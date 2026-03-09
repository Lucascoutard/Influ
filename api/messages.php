<?php
/* ===================================================
   API/MESSAGES.PHP — Messagerie Influmatch
   Actions : conversations · messages · send · upload
             ensure_default · create_group · users
   =================================================== */

require_once '../config/database.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---- Auth ----
if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non authentifié']);
    exit;
}

$user   = $_SESSION['user'];
$pdo    = getDB();
$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    switch ($action) {
        case 'conversations':  getConversations($pdo, $user); break;
        case 'messages':       getMessages($pdo, $user);      break;
        case 'send':           sendMessage($pdo, $user);      break;
        case 'upload':         uploadFile($pdo, $user);       break;
        case 'ensure_default': ensureDefault($pdo, $user);    break;
        case 'mark_read':      markRead($pdo, $user);         break;
        case 'create_group':   createGroup($pdo, $user);      break;
        case 'users':          getUsers($pdo, $user);         break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Action invalide']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur']);
}

// ================================================================
//  HANDLERS
// ================================================================

function getConversations($pdo, $user) {
    $stmt = $pdo->prepare("
        SELECT c.id, c.name, c.type, c.updated_at,
               m.content    AS last_content,
               m.type       AS last_type,
               m.created_at AS last_at,
               u.firstname  AS last_sender,
               (SELECT COUNT(*) FROM messages m2
                WHERE m2.conversation_id = c.id
                  AND m2.id > cp.last_read_msg_id
                  AND m2.sender_id != :uid2) AS unread_count
        FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = :uid
        LEFT JOIN messages m ON m.id = (
            SELECT id FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
        )
        LEFT JOIN users u ON u.id = m.sender_id
        ORDER BY COALESCE(m.created_at, c.created_at) DESC
    ");
    $stmt->execute([':uid' => $user['id'], ':uid2' => $user['id']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($rows as &$row) {
        $ps = $pdo->prepare("
            SELECT u.id, u.firstname, u.lastname, u.role
            FROM conversation_participants cp
            JOIN users u ON u.id = cp.user_id
            WHERE cp.conversation_id = ?
        ");
        $ps->execute([$row['id']]);
        $row['participants'] = $ps->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(['conversations' => $rows]);
}

// ----------------------------------------------------------------
function getMessages($pdo, $user) {
    $convId = (int)($_GET['conversation_id'] ?? 0);
    $after  = (int)($_GET['after'] ?? 0);

    if (!$convId) { http_response_code(400); echo json_encode(['error' => 'conversation_id requis']); return; }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }

    if ($after > 0) {
        $stmt = $pdo->prepare("
            SELECT m.id, m.conversation_id, m.sender_id, m.content, m.type,
                   m.file_name, m.file_path, m.file_size, m.created_at,
                   u.firstname, u.lastname, u.role
            FROM messages m JOIN users u ON u.id = m.sender_id
            WHERE m.conversation_id = ? AND m.id > ?
            ORDER BY m.created_at ASC LIMIT 100
        ");
        $stmt->execute([$convId, $after]);
    } else {
        $stmt = $pdo->prepare("
            SELECT m.id, m.conversation_id, m.sender_id, m.content, m.type,
                   m.file_name, m.file_path, m.file_size, m.created_at,
                   u.firstname, u.lastname, u.role
            FROM messages m JOIN users u ON u.id = m.sender_id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC LIMIT 100
        ");
        $stmt->execute([$convId]);
    }

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Read status of other participants (for "Vu" indicator)
    $rs = $pdo->prepare("
        SELECT user_id, COALESCE(last_read_msg_id, 0) AS last_read_msg_id
        FROM conversation_participants
        WHERE conversation_id = ? AND user_id != ?
    ");
    $rs->execute([$convId, $user['id']]);
    $readStatus = [];
    foreach ($rs->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $readStatus[(string)$r['user_id']] = (int)$r['last_read_msg_id'];
    }

    echo json_encode(['messages' => $messages, 'read_status' => $readStatus]);
}

// ----------------------------------------------------------------
function sendMessage($pdo, $user) {
    $body    = json_decode(file_get_contents('php://input'), true) ?? [];
    $convId  = (int)($body['conversation_id'] ?? 0);
    $content = trim($body['content'] ?? '');

    if (!$convId || $content === '') { http_response_code(400); echo json_encode(['error' => 'Données manquantes']); return; }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }

    $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content, type) VALUES (?,?,?,'text')")
        ->execute([$convId, $user['id'], $content]);
    $id = (int)$pdo->lastInsertId();

    $pdo->prepare("UPDATE conversations SET updated_at=NOW() WHERE id=?")->execute([$convId]);

    $msg = $pdo->prepare("
        SELECT m.*, u.firstname, u.lastname, u.role
        FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id=?
    ");
    $msg->execute([$id]);
    echo json_encode(['message' => $msg->fetch(PDO::FETCH_ASSOC)]);
}

// ----------------------------------------------------------------
function uploadFile($pdo, $user) {
    $convId = (int)($_POST['conversation_id'] ?? 0);
    if (!$convId || !isset($_FILES['file'])) { http_response_code(400); echo json_encode(['error' => 'Données manquantes']); return; }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }

    $file = $_FILES['file'];
    if ($file['error'] !== UPLOAD_ERR_OK)      { http_response_code(400); echo json_encode(['error' => 'Erreur upload']); return; }
    if ($file['size'] > 50 * 1024 * 1024)      { http_response_code(400); echo json_encode(['error' => 'Max 50 Mo']); return; }

    $imgTypes  = ['image/jpeg','image/png','image/gif','image/webp'];
    $videoTypes= ['video/mp4','video/webm','video/quicktime','video/x-msvideo','video/x-matroska'];
    $docTypes  = ['application/pdf','application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
    $allowed   = array_merge($imgTypes, $videoTypes, $docTypes);

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file['tmp_name']);
    if (!in_array($mime, $allowed)) { http_response_code(400); echo json_encode(['error' => 'Type non autorisé']); return; }

    $isImage = in_array($mime, $imgTypes);
    $type    = $isImage ? 'image' : 'file';

    $uploadDir = __DIR__ . '/../public/uploads/messages/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $safeName = uniqid('msg_', true) . '.' . preg_replace('/[^a-z0-9]/', '', $ext);

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $safeName)) {
        http_response_code(500); echo json_encode(['error' => 'Échec du déplacement']); return;
    }

    $publicPath = 'public/uploads/messages/' . $safeName;

    $pdo->prepare("
        INSERT INTO messages (conversation_id, sender_id, content, type, file_name, file_path, file_size)
        VALUES (?, ?, '', ?, ?, ?, ?)
    ")->execute([$convId, $user['id'], $type, $file['name'], $publicPath, $file['size']]);
    $id = (int)$pdo->lastInsertId();

    $pdo->prepare("UPDATE conversations SET updated_at=NOW() WHERE id=?")->execute([$convId]);

    $msg = $pdo->prepare("
        SELECT m.*, u.firstname, u.lastname, u.role
        FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id=?
    ");
    $msg->execute([$id]);
    echo json_encode(['message' => $msg->fetch(PDO::FETCH_ASSOC)]);
}

// ----------------------------------------------------------------
function ensureDefault($pdo, $user) {
    if ($user['role'] !== 'client') { echo json_encode(['status' => 'ok']); return; }

    // Check if already has a convo with an admin
    $check = $pdo->prepare("
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
        JOIN conversation_participants cp2 ON cp2.conversation_id = c.id
        JOIN users u2 ON u2.id = cp2.user_id AND u2.role = 'admin'
        WHERE c.type = 'direct'
        LIMIT 1
    ");
    $check->execute([$user['id']]);
    $existing = $check->fetch(PDO::FETCH_ASSOC);

    $admins = $pdo->query("SELECT id, firstname FROM users WHERE role='admin' ORDER BY id ASC")
                  ->fetchAll(PDO::FETCH_ASSOC);

    if (empty($admins)) { echo json_encode(['status' => 'no_admin']); return; }

    if ($existing) {
        // Ajoute les admins créés après la conversation
        foreach ($admins as $admin) {
            $pdo->prepare("INSERT IGNORE INTO conversation_participants (conversation_id, user_id) VALUES (?,?)")
                ->execute([$existing['id'], $admin['id']]);
        }
        echo json_encode(['status' => 'exists', 'conversation_id' => $existing['id']]);
        return;
    }

    $pdo->exec("INSERT INTO conversations (type) VALUES ('direct')");
    $convId = (int)$pdo->lastInsertId();

    // Add client + all admins
    $pdo->prepare("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?,?)")->execute([$convId, $user['id']]);
    foreach ($admins as $admin) {
        $pdo->prepare("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?,?)")->execute([$convId, $admin['id']]);
    }

    // Welcome message from first admin
    $first = $admins[0];
    $pdo->prepare("
        INSERT INTO messages (conversation_id, sender_id, content, type)
        VALUES (?, ?, ?, 'text')
    ")->execute([
        $convId,
        $first['id'],
        "Bonjour 👋 Je suis {$first['firstname']}, co-fondateur d'Influmatch. N'hésitez pas à nous écrire ici pour toute question sur votre campagne. On est là pour vous !"
    ]);

    echo json_encode(['status' => 'created', 'conversation_id' => $convId]);
}

// ----------------------------------------------------------------
function createGroup($pdo, $user) {
    if ($user['role'] !== 'admin') { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }

    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($body['name'] ?? '');
    $ids  = array_map('intval', $body['participants'] ?? []);

    if (!$name || empty($ids)) { http_response_code(400); echo json_encode(['error' => 'Données manquantes']); return; }

    $pdo->prepare("INSERT INTO conversations (name, type) VALUES (?, 'group')")->execute([$name]);
    $convId = (int)$pdo->lastInsertId();

    $added = [];
    $pdo->prepare("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?,?)")->execute([$convId, $user['id']]);
    $added[] = $user['id'];

    foreach ($ids as $pid) {
        if ($pid > 0 && !in_array($pid, $added)) {
            $pdo->prepare("INSERT INTO conversation_participants (conversation_id, user_id) VALUES (?,?)")->execute([$convId, $pid]);
            $added[] = $pid;
        }
    }

    echo json_encode(['status' => 'created', 'conversation_id' => $convId]);
}

// ----------------------------------------------------------------
function markRead($pdo, $user) {
    $convId = (int)($_GET['conversation_id'] ?? 0);
    if (!$convId) { http_response_code(400); echo json_encode(['error' => 'conversation_id requis']); return; }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }

    $last = $pdo->prepare("SELECT COALESCE(MAX(id), 0) AS last_id FROM messages WHERE conversation_id = ?");
    $last->execute([$convId]);
    $lastId = (int)$last->fetch()['last_id'];

    $pdo->prepare("UPDATE conversation_participants SET last_read_msg_id = ? WHERE conversation_id = ? AND user_id = ?")
        ->execute([$lastId, $convId, $user['id']]);

    echo json_encode(['ok' => true]);
}

// ----------------------------------------------------------------
function getUsers($pdo, $user) {
    if ($user['role'] !== 'admin') { http_response_code(403); echo json_encode(['error' => 'Accès refusé']); return; }
    $stmt = $pdo->query("SELECT id, firstname, lastname, email, role FROM users ORDER BY firstname, lastname");
    echo json_encode(['users' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}
