<?php
/* ===================================================
   API/COLLABORATIONS.PHP — Gestion des collaborations
   GET  ?action=list
   POST ?action=create
   PUT  ?action=update
   PUT  ?action=delete
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {

    // ======================== LIST ========================
    case 'list':
        requireRole('admin');
        $db = getDB();
        $rows = $db->query("
            SELECT
              c.id, c.title, c.status, c.budget,
              c.start_date, c.end_date, c.description,
              c.created_at, c.updated_at,
              b.id   AS brand_id,
              b.firstname AS brand_firstname, b.lastname AS brand_lastname,
              b.company   AS brand_company,  b.email    AS brand_email,
              i.id   AS influencer_id,
              i.firstname AS inf_firstname,  i.lastname AS inf_lastname,
              i.email     AS inf_email
            FROM collaborations c
            JOIN users b ON b.id = c.brand_id
            JOIN users i ON i.id = c.influencer_id
            ORDER BY c.created_at DESC
        ")->fetchAll();
        jsonResponse(['success' => true, 'collaborations' => $rows]);
        break;

    // ======================== CREATE ========================
    case 'create':
        $admin = requireRole('admin');
        $data  = getJsonBody();
        $error = validateRequired($data, ['title', 'brand_id', 'influencer_id']);
        if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

        $db = getDB();
        $db->prepare("
            INSERT INTO collaborations
              (title, brand_id, influencer_id, created_by, status, budget, start_date, end_date, description)
            VALUES (?, ?, ?, ?, 'pending', ?, ?, ?, ?)
        ")->execute([
            trim($data['title']),
            (int)$data['brand_id'],
            (int)$data['influencer_id'],
            (int)$admin['id'],
            $data['budget'] ?? null,
            $data['start_date'] ?: null,
            $data['end_date']   ?: null,
            trim($data['description'] ?? ''),
        ]);
        $id = $db->lastInsertId();

        $row = $db->prepare("
            SELECT c.id, c.title, c.status, c.budget, c.start_date, c.end_date,
                   c.description, c.created_at, c.updated_at,
                   b.id AS brand_id,
                   b.firstname AS brand_firstname, b.lastname AS brand_lastname,
                   b.company   AS brand_company,  b.email    AS brand_email,
                   i.id AS influencer_id,
                   i.firstname AS inf_firstname, i.lastname AS inf_lastname,
                   i.email     AS inf_email
            FROM collaborations c
            JOIN users b ON b.id = c.brand_id
            JOIN users i ON i.id = c.influencer_id
            WHERE c.id = ?
        ");
        $row->execute([$id]);
        jsonResponse(['success' => true, 'collaboration' => $row->fetch()], 201);
        break;

    // ======================== UPDATE ========================
    case 'update':
        requireRole('admin');
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID invalide.'], 422);

        $allowed = ['title','status','budget','start_date','end_date','description'];
        $sets = []; $vals = [];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $sets[] = "$col = ?";
                $val = $data[$col];
                if ($col === 'status' && !in_array($val, ['pending','active','completed','cancelled']))
                    jsonResponse(['success' => false, 'message' => 'Statut invalide.'], 422);
                $vals[] = ($val === '' && in_array($col, ['budget','start_date','end_date'])) ? null : $val;
            }
        }
        if (empty($sets)) jsonResponse(['success' => false, 'message' => 'Rien à mettre à jour.'], 422);

        $db = getDB();
        $vals[] = $id;
        $db->prepare("UPDATE collaborations SET " . implode(', ', $sets) . " WHERE id = ?")->execute($vals);
        jsonResponse(['success' => true, 'message' => 'Collaboration mise à jour.']);
        break;

    // ======================== DELETE ========================
    case 'delete':
        requireRole('admin');
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID invalide.'], 422);
        $db = getDB();
        $db->prepare('DELETE FROM collaborations WHERE id = ?')->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Collaboration supprimée.']);
        break;

    // ======================== MY COLLABS (client / influencer) ========================
    case 'my_collabs':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $db   = getDB();
        $stmt = $db->prepare("
            SELECT
              c.id, c.title, c.status, c.budget,
              c.start_date, c.end_date, c.description,
              c.created_at, c.updated_at,
              b.id   AS brand_id,
              b.firstname AS brand_firstname, b.lastname AS brand_lastname,
              b.company   AS brand_company,
              i.id   AS influencer_id,
              i.firstname AS inf_firstname, i.lastname AS inf_lastname,
              i.email     AS inf_email
            FROM collaborations c
            JOIN users b ON b.id = c.brand_id
            JOIN users i ON i.id = c.influencer_id
            WHERE c.brand_id = ? OR c.influencer_id = ?
            ORDER BY c.created_at DESC
        ");
        $stmt->execute([$uid, $uid]);
        jsonResponse(['success' => true, 'collaborations' => $stmt->fetchAll()]);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Action inconnue.'], 400);
}
