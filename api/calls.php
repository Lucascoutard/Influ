<?php
/* ===================================================
   API/CALLS.PHP — Signalisation WebRTC Influmatch
   Actions : signal · poll · listen
   =================================================== */

require_once '../config/database.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non authentifié']);
    exit;
}

$user   = $_SESSION['user'];
$pdo    = getDB();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'signal':          sendSignal($pdo, $user);    break;
        case 'poll':            pollSignals($pdo, $user);  break;
        case 'listen':          listenForCalls($pdo, $user); break;
        case 'save_call_event': saveCallEvent($pdo, $user); break;
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

/**
 * Envoie un signal WebRTC (offer, answer, ice_candidate, hangup, reject)
 */
function sendSignal($pdo, $user) {
    $body    = json_decode(file_get_contents('php://input'), true) ?? [];
    $convId  = (int)($body['conversation_id'] ?? 0);
    $type    = $body['type'] ?? '';
    $payload = $body['payload'] ?? null;

    $allowed = ['offer', 'answer', 'ice_candidate', 'hangup', 'reject'];
    if (!$convId || !in_array($type, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Données invalides']);
        return;
    }

    // Vérif participant
    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès refusé']);
        return;
    }

    $pdo->prepare("INSERT INTO call_signals (conversation_id, sender_id, type, payload) VALUES (?,?,?,?)")
        ->execute([$convId, $user['id'], $type, json_encode($payload)]);

    echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
}

/**
 * Récupère les signaux d'une conversation (pour les deux pairs pendant un appel)
 */
function pollSignals($pdo, $user) {
    $convId  = (int)($_GET['conversation_id'] ?? 0);
    $afterId = (int)($_GET['after_id'] ?? 0);

    if (!$convId) {
        http_response_code(400);
        echo json_encode(['error' => 'conversation_id requis']);
        return;
    }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès refusé']);
        return;
    }

    // Nettoie les vieux signaux (> 2 min)
    $pdo->exec("DELETE FROM call_signals WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 MINUTE)");

    $stmt = $pdo->prepare("
        SELECT cs.id, cs.conversation_id, cs.sender_id, cs.type, cs.payload,
               u.firstname, u.lastname
        FROM call_signals cs
        JOIN users u ON u.id = cs.sender_id
        WHERE cs.conversation_id = ?
          AND cs.sender_id != ?
          AND cs.id > ?
        ORDER BY cs.id ASC
        LIMIT 50
    ");
    $stmt->execute([$convId, $user['id'], $afterId]);
    $signals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($signals as &$s) {
        $s['payload'] = json_decode($s['payload'], true);
    }

    echo json_encode(['signals' => $signals]);
}

/**
 * Sauvegarde un événement d'appel dans la table messages (type='call_event')
 */
function saveCallEvent($pdo, $user) {
    $body     = json_decode(file_get_contents('php://input'), true) ?? [];
    $convId   = (int)($body['conversation_id'] ?? 0);
    $callType = $body['call_type'] ?? 'audio';   // 'audio' ou 'video'
    $status   = $body['status']    ?? 'ended';   // 'ended' ou 'missed'
    $duration = isset($body['duration']) ? (int)$body['duration'] : null;

    if (!$convId || !in_array($status, ['ended', 'missed'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Données invalides']);
        return;
    }

    $ok = $pdo->prepare("SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=?");
    $ok->execute([$convId, $user['id']]);
    if (!$ok->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès refusé']);
        return;
    }

    $content = json_encode(['call_type' => $callType, 'status' => $status, 'duration' => $duration]);

    $pdo->prepare("INSERT INTO messages (conversation_id, sender_id, content, type) VALUES (?,?,?,'call_event')")
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

/**
 * Écoute globale : détecte les appels entrants dans toutes les convs de l'utilisateur
 */
function listenForCalls($pdo, $user) {
    $afterId = (int)($_GET['after_id'] ?? 0);

    $stmt = $pdo->prepare("
        SELECT cs.id, cs.conversation_id, cs.sender_id, cs.type, cs.payload,
               u.firstname, u.lastname
        FROM call_signals cs
        JOIN conversation_participants cp
            ON cp.conversation_id = cs.conversation_id AND cp.user_id = ?
        JOIN users u ON u.id = cs.sender_id
        WHERE cs.sender_id != ?
          AND cs.type = 'offer'
          AND cs.id > ?
          AND cs.created_at > DATE_SUB(NOW(), INTERVAL 30 SECOND)
        ORDER BY cs.id ASC
        LIMIT 5
    ");
    $stmt->execute([$user['id'], $user['id'], $afterId]);
    $signals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($signals as &$s) {
        $s['payload'] = json_decode($s['payload'], true);
    }

    echo json_encode(['signals' => $signals]);
}
