<?php
/* ===================================================
   API/TASKS.PHP - Campaign task tracking (campaign_tasks)
   GET  ?action=list&collab_id=X
   POST ?action=create
   POST ?action=update
   POST ?action=delete
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? 'list';
$user   = requireAuth();

switch ($action) {

    // ======================== MY TASKS (all open tasks for current user) ========================
    case 'my_tasks':
        $uid = (int)$user['id'];
        $db  = getDB();
        $stmt = $db->prepare("
            SELECT t.id, t.title, t.content_type, t.platform, t.status, t.due_date,
                   c.id AS collab_id, c.title AS collab_title
            FROM campaign_tasks t
            JOIN collaborations c ON c.id = t.collab_id
            WHERE (c.influencer_id = ? OR c.brand_id = ?)
              AND t.status IN ('todo', 'in_progress')
            ORDER BY t.due_date IS NULL, t.due_date ASC, t.created_at ASC
            LIMIT 20
        ");
        $stmt->execute([$uid, $uid]);
        jsonResponse(['success' => true, 'tasks' => $stmt->fetchAll()]);
        break;

    // ======================== LIST ========================
    case 'list':
        $collabId = (int)($_GET['collab_id'] ?? 0);
        if (!$collabId) jsonResponse(['success' => false, 'message' => 'collab_id required.'], 422);

        $db = getDB();

        // Verify user access to this collaboration
        if ($user['role'] !== 'admin') {
            $check = $db->prepare("SELECT id FROM collaborations WHERE id = ? AND (brand_id = ? OR influencer_id = ?)");
            $check->execute([$collabId, $user['id'], $user['id']]);
            if (!$check->fetch()) {
                jsonResponse(['success' => false, 'message' => 'Unauthorized access.'], 403);
            }
        }

        $stmt = $db->prepare("
            SELECT t.*, u.firstname AS creator_firstname, u.lastname AS creator_lastname
            FROM campaign_tasks t
            LEFT JOIN users u ON u.id = t.created_by
            WHERE t.collab_id = ?
            ORDER BY t.status, t.due_date, t.created_at
        ");
        $stmt->execute([$collabId]);
        jsonResponse(['success' => true, 'tasks' => $stmt->fetchAll()]);
        break;

    // ======================== CREATE ========================
    case 'create':
        $data     = getJsonBody();
        $collabId = (int)($data['collab_id'] ?? 0);
        if (!$collabId) jsonResponse(['success' => false, 'message' => 'collab_id required.'], 422);
        if (empty(trim($data['title'] ?? ''))) jsonResponse(['success' => false, 'message' => 'Title required.'], 422);

        $db = getDB();

        // Admins and collaboration influencers can create tasks
        if ($user['role'] !== 'admin') {
            $check = $db->prepare("SELECT id FROM collaborations WHERE id = ? AND influencer_id = ?");
            $check->execute([$collabId, $user['id']]);
            if (!$check->fetch()) jsonResponse(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $validStatuses = ['todo', 'in_progress', 'done', 'validated'];
        $status = in_array($data['status'] ?? '', $validStatuses) ? $data['status'] : 'todo';

        $db->prepare("
            INSERT INTO campaign_tasks
              (collab_id, title, content_type, platform, status, due_date, published_url, notes, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ")->execute([
            $collabId,
            trim($data['title']),
            trim($data['content_type'] ?? '') ?: null,
            trim($data['platform'] ?? '') ?: null,
            $status,
            $data['due_date'] ?: null,
            trim($data['published_url'] ?? '') ?: null,
            trim($data['notes'] ?? '') ?: null,
            $user['id'],
        ]);
        $id = $db->lastInsertId();

        $stmt = $db->prepare("
            SELECT t.*, u.firstname AS creator_firstname, u.lastname AS creator_lastname
            FROM campaign_tasks t
            LEFT JOIN users u ON u.id = t.created_by
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);
        jsonResponse(['success' => true, 'task' => $stmt->fetch()], 201);
        break;

    // ======================== UPDATE ========================
    case 'update':
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'Invalid ID.'], 422);

        $db = getDB();

        // Verify task exists and user has access
        $task = $db->prepare("
            SELECT t.*, c.brand_id, c.influencer_id
            FROM campaign_tasks t
            JOIN collaborations c ON c.id = t.collab_id
            WHERE t.id = ?
        ");
        $task->execute([$id]);
        $t = $task->fetch();
        if (!$t) jsonResponse(['success' => false, 'message' => 'Task not found.'], 404);

        $isBrand      = (int)$t['brand_id']      === (int)$user['id'];
        $isInfluencer = (int)$t['influencer_id'] === (int)$user['id'];
        $isAdmin      = $user['role'] === 'admin';

        // Brand: can only validate or undo validation
        if ($isBrand && !$isAdmin && !$isInfluencer) {
            $newStatus = $data['status'] ?? null;
            $allowed   = ($t['status'] === 'done' && $newStatus === 'validated')
                      || ($t['status'] === 'validated' && $newStatus === 'done');
            if (!$allowed) jsonResponse(['success' => false, 'message' => 'Brands can only validate completed tasks.'], 403);
            $db->prepare("UPDATE campaign_tasks SET status = ? WHERE id = ?")->execute([$newStatus, $id]);
            jsonResponse(['success' => true, 'message' => 'Status updated.']);
        }

        // Influencer or admin can perform full edits
        if (!$isAdmin && !$isInfluencer) {
            jsonResponse(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $validStatuses = ['todo', 'in_progress', 'done', 'validated'];
        // Influencer cannot force "validated" status (brand only)
        if (!$isAdmin && ($data['status'] ?? '') === 'validated') {
            jsonResponse(['success' => false, 'message' => 'Only the brand can validate a task.'], 403);
        }
        $allowed = ['title', 'content_type', 'platform', 'status', 'due_date', 'published_url', 'notes'];
        $sets = []; $vals = [];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                if ($col === 'status' && !in_array($data[$col], $validStatuses)) continue;
                $sets[] = "$col = ?";
                $val    = $data[$col];
                $vals[] = ($val === '' && in_array($col, ['due_date', 'published_url', 'content_type', 'platform'])) ? null : $val;
            }
        }
        if (empty($sets)) jsonResponse(['success' => false, 'message' => 'Nothing to update.'], 422);

        $vals[] = $id;
        $db->prepare("UPDATE campaign_tasks SET " . implode(', ', $sets) . " WHERE id = ?")->execute($vals);
        jsonResponse(['success' => true, 'message' => 'Task updated.']);
        break;

    // ======================== DELETE ========================
    case 'delete':
        $data = getJsonBody();
        $id   = (int)($data['id'] ?? 0);
        if (!$id) jsonResponse(['success' => false, 'message' => 'Invalid ID.'], 422);

        $db = getDB();

        // Only admins and collaboration influencer can delete
        if ($user['role'] !== 'admin') {
            $check = $db->prepare("
                SELECT t.id FROM campaign_tasks t
                JOIN collaborations c ON c.id = t.collab_id
                WHERE t.id = ? AND c.influencer_id = ?
            ");
            $check->execute([$id, $user['id']]);
            if (!$check->fetch()) jsonResponse(['success' => false, 'message' => 'Unauthorized access.'], 403);
        }

        $db->prepare("DELETE FROM campaign_tasks WHERE id = ?")->execute([$id]);
        jsonResponse(['success' => true, 'message' => 'Task deleted.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Unknown action.'], 400);
}


