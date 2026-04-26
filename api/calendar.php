<?php
/* ===================================================
   API/CALENDAR.PHP - Event management
   Actions: list | create | delete
   =================================================== */

require_once '../config/database.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$user   = $_SESSION['user'];
$pdo    = getDB();
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'list':
            listEvents($pdo, $user);
            break;
        case 'create':
            createEvent($pdo, $user);
            break;
        case 'delete':
            deleteEvent($pdo, $user);
            break;
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}

function listEvents(PDO $pdo, array $user): void {
    $year  = (int)($_GET['year'] ?? date('Y'));
    $month = (int)($_GET['month'] ?? date('n'));

    $from = sprintf('%04d-%02d-01 00:00:00', $year, $month);
    $to   = date('Y-m-t 23:59:59', mktime(0, 0, 0, $month, 1, $year));

    if ($user['role'] === 'admin') {
        $stmt = $pdo->prepare(
            "SELECT e.*, CONCAT(u.firstname, ' ', u.lastname) AS client_name
             FROM events e
             LEFT JOIN users u ON u.id = e.client_id
             WHERE e.start_at BETWEEN ? AND ?
             ORDER BY e.start_at ASC"
        );
        $stmt->execute([$from, $to]);
    } else {
        $stmt = $pdo->prepare(
            "SELECT e.*, CONCAT(u.firstname, ' ', u.lastname) AS client_name
             FROM events e
             LEFT JOIN users u ON u.id = e.client_id
             WHERE e.start_at BETWEEN ? AND ?
               AND (e.client_id = ? OR e.created_by = ?)
             ORDER BY e.start_at ASC"
        );
        $stmt->execute([$from, $to, $user['id'], $user['id']]);
    }

    echo json_encode(['events' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

function createEvent(PDO $pdo, array $user): void {
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        return;
    }

    $body     = json_decode(file_get_contents('php://input'), true) ?? [];
    $title    = trim($body['title'] ?? '');
    $type     = $body['type'] ?? 'call';
    $startAt  = trim($body['start_at'] ?? '');
    $endAt    = !empty($body['end_at']) ? trim($body['end_at']) : null;
    $location = !empty($body['location']) ? trim($body['location']) : null;
    $desc     = !empty($body['description']) ? trim($body['description']) : null;
    $clientId = !empty($body['client_id']) ? (int)$body['client_id'] : null;

    if (!$title || !$startAt) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and start date are required']);
        return;
    }

    $validTypes = ['call', 'meeting', 'demo', 'other'];
    if (!in_array($type, $validTypes, true)) {
        $type = 'call';
    }

    $pdo->prepare('INSERT INTO events (title, type, start_at, end_at, location, description, client_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        ->execute([$title, $type, $startAt, $endAt, $location, $desc, $clientId, $user['id']]);

    echo json_encode(['id' => (int)$pdo->lastInsertId()]);
}

function deleteEvent(PDO $pdo, array $user): void {
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Access denied']);
        return;
    }

    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'id required']);
        return;
    }

    $pdo->prepare('DELETE FROM events WHERE id = ?')->execute([$id]);
    echo json_encode(['ok' => true]);
}
