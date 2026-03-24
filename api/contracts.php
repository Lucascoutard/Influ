<?php
/* ===================================================
   API/CONTRACTS.PHP — Gestion des contrats
   GET  ?action=list          → admin : tous les contrats
   GET  ?action=my_contracts  → client : ses contrats
   POST ?action=upload        → admin : upload PDF + notif email
   POST ?action=sign          → client : upload PDF signé
   GET  ?action=download&id=X&type=unsigned|signed
   POST ?action=delete        → admin : suppression
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? '';

/* ── Constante chemin uploads ── */
define('CONTRACTS_DIR', __DIR__ . '/../public/uploads/contracts/');

switch ($action) {

    // ======================== LIST (admin) ========================
    case 'list':
        requireRole('admin');
        $db   = getDB();
        $rows = $db->query("
            SELECT
              ct.id, ct.title, ct.description, ct.status,
              ct.email_sent, ct.signed_at, ct.created_at, ct.updated_at,
              ct.unsigned_path, ct.signed_path,
              cl.id   AS client_id,
              cl.firstname AS client_firstname, cl.lastname AS client_lastname,
              cl.email     AS client_email, cl.company AS client_company,
              co.id    AS collab_id, co.title AS collab_title
            FROM contracts ct
            JOIN users cl ON cl.id = ct.client_id
            LEFT JOIN collaborations co ON co.id = ct.collab_id
            ORDER BY ct.created_at DESC
        ")->fetchAll();
        jsonResponse(['success' => true, 'contracts' => $rows]);
        break;

    // ======================== MY_CONTRACTS (client) ========================
    case 'my_contracts':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $db   = getDB();
        $stmt = $db->prepare("
            SELECT
              ct.id, ct.title, ct.description, ct.status,
              ct.signed_at, ct.created_at,
              ct.unsigned_path, ct.signed_path,
              co.id AS collab_id, co.title AS collab_title
            FROM contracts ct
            LEFT JOIN collaborations co ON co.id = ct.collab_id
            WHERE ct.client_id = ?
            ORDER BY ct.created_at DESC
        ");
        $stmt->execute([$uid]);
        jsonResponse(['success' => true, 'contracts' => $stmt->fetchAll()]);
        break;

    // ======================== UPLOAD (admin, multipart) ========================
    case 'upload':
        $admin = requireRole('admin');

        $title    = trim($_POST['title']       ?? '');
        $clientId = (int)($_POST['client_id']  ?? 0);
        $collabId = (int)($_POST['collab_id']  ?? 0) ?: null;
        $desc     = trim($_POST['description'] ?? '');

        if (!$title || !$clientId)
            jsonResponse(['success' => false, 'message' => 'Titre et client requis.'], 422);

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK)
            jsonResponse(['success' => false, 'message' => 'Fichier PDF requis.'], 422);

        $file = $_FILES['file'];
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf')
            jsonResponse(['success' => false, 'message' => 'Seuls les fichiers PDF sont acceptés.'], 422);
        if ($file['size'] > 15 * 1024 * 1024)
            jsonResponse(['success' => false, 'message' => 'Fichier trop lourd (max 15 Mo).'], 422);

        // Validate MIME type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']);
        if ($mime !== 'application/pdf')
            jsonResponse(['success' => false, 'message' => 'Le fichier n\'est pas un PDF valide.'], 422);

        $dir = CONTRACTS_DIR . 'unsigned/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $filename   = uniqid('contract_', true) . '.pdf';
        $dest       = $dir . $filename;
        $relativePath = 'contracts/unsigned/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest))
            jsonResponse(['success' => false, 'message' => 'Erreur lors de l\'enregistrement du fichier.'], 500);

        $db = getDB();
        $db->prepare("
            INSERT INTO contracts
              (title, client_id, collab_id, description, unsigned_path, created_by, status)
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ")->execute([$title, $clientId, $collabId, $desc, $relativePath, $admin['id']]);
        $id = $db->lastInsertId();

        // Send email notification
        require_once __DIR__ . '/../lib/Mailer.php';
        $clientRow = $db->prepare('SELECT email, firstname, lastname FROM users WHERE id = ?');
        $clientRow->execute([$clientId]);
        $clientRow = $clientRow->fetch();
        $emailSent = false;
        if ($clientRow) {
            $emailSent = Mailer::sendNewContract(
                $clientRow['email'],
                trim($clientRow['firstname'] . ' ' . $clientRow['lastname']),
                $title,
                $desc
            );
            if ($emailSent)
                $db->prepare('UPDATE contracts SET email_sent = 1 WHERE id = ?')->execute([$id]);
        }

        jsonResponse([
            'success'    => true,
            'message'    => 'Contrat envoyé' . ($emailSent ? ' avec notification email.' : '.'),
            'id'         => (int)$id,
            'email_sent' => $emailSent,
        ], 201);
        break;

    // ======================== SIGN (client, multipart) ========================
    case 'sign':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $id   = (int)($_POST['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID requis.'], 422);

        $db       = getDB();
        $contract = $db->prepare('SELECT * FROM contracts WHERE id = ? AND client_id = ?');
        $contract->execute([$id, $uid]);
        $contract = $contract->fetch();
        if (!$contract)
            jsonResponse(['success' => false, 'message' => 'Contrat introuvable ou accès refusé.'], 404);
        if ($contract['status'] === 'signed')
            jsonResponse(['success' => false, 'message' => 'Ce contrat est déjà signé.'], 409);

        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK)
            jsonResponse(['success' => false, 'message' => 'Fichier PDF requis.'], 422);

        $file = $_FILES['file'];
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($ext !== 'pdf')
            jsonResponse(['success' => false, 'message' => 'Seuls les fichiers PDF sont acceptés.'], 422);
        if ($file['size'] > 15 * 1024 * 1024)
            jsonResponse(['success' => false, 'message' => 'Fichier trop lourd (max 15 Mo).'], 422);

        $dir = CONTRACTS_DIR . 'signed/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);

        $filename     = uniqid('signed_', true) . '.pdf';
        $dest         = $dir . $filename;
        $relativePath = 'contracts/signed/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest))
            jsonResponse(['success' => false, 'message' => 'Erreur lors de l\'enregistrement.'], 500);

        $db->prepare("
            UPDATE contracts SET signed_path = ?, status = 'signed', signed_at = NOW() WHERE id = ?
        ")->execute([$relativePath, $id]);

        // Notify admins
        require_once __DIR__ . '/../lib/Mailer.php';
        $clientName = trim($user['firstname'] . ' ' . $user['lastname']);
        $admins = $db->query("SELECT email, firstname, lastname FROM users WHERE role = 'admin' AND is_active = 1")->fetchAll();
        foreach ($admins as $a) {
            Mailer::sendContractSigned(
                $a['email'],
                trim($a['firstname'] . ' ' . $a['lastname']),
                $contract['title'],
                $clientName
            );
        }

        jsonResponse(['success' => true, 'message' => 'Contrat signé et envoyé avec succès.']);
        break;

    // ======================== DOWNLOAD ========================
    case 'download':
        $user = requireAuth();
        $id   = (int)($_GET['id']   ?? 0);
        $type = $_GET['type'] === 'signed' ? 'signed' : 'unsigned';
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID requis.'], 422);

        $db  = getDB();
        $row = $db->prepare('SELECT * FROM contracts WHERE id = ?');
        $row->execute([$id]);
        $row = $row->fetch();
        if (!$row) jsonResponse(['success' => false, 'message' => 'Contrat introuvable.'], 404);

        // Check access
        if ($user['role'] !== 'admin' && (int)$row['client_id'] !== (int)$user['id'])
            jsonResponse(['success' => false, 'message' => 'Accès refusé.'], 403);

        $col     = $type === 'signed' ? 'signed_path' : 'unsigned_path';
        $rawPath = $row[$col] ?? null;
        if (!$rawPath)
            jsonResponse(['success' => false, 'message' => 'Fichier introuvable.'], 404);

        // Prevent path traversal — resolve real path and verify it stays inside contracts dir (OWASP A01)
        $baseDir = realpath(__DIR__ . '/../public/uploads/contracts');
        $path    = realpath(__DIR__ . '/../' . $rawPath);
        if (!$path || !$baseDir || strncmp($path, $baseDir, strlen($baseDir)) !== 0)
            jsonResponse(['success' => false, 'message' => 'Accès refusé.'], 403);
        if (!file_exists($path))
            jsonResponse(['success' => false, 'message' => 'Fichier introuvable.'], 404);

        // Send file (override JSON Content-Type)
        $safeName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $row['title'])
                    . ($type === 'signed' ? '_signe' : '') . '.pdf';
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $safeName . '"');
        header('Content-Length: ' . filesize($path));
        header('Cache-Control: private');
        readfile($path);
        exit;

    // ======================== DELETE (admin) ========================
    case 'delete':
        requireRole('admin');
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID invalide.'], 422);

        $db  = getDB();
        $row = $db->prepare('SELECT unsigned_path, signed_path FROM contracts WHERE id = ?');
        $row->execute([$id]);
        $row = $row->fetch();

        if ($row) {
            // Delete physical files
            foreach (['unsigned_path', 'signed_path'] as $col) {
                if ($row[$col]) {
                    $f = CONTRACTS_DIR . '../' . $row[$col];
                    if (file_exists($f)) unlink($f);
                }
            }
        }

        $db->prepare('DELETE FROM contracts WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Contrat supprimé.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Action inconnue.'], 400);
}
