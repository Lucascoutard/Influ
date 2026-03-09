<?php
/* ===================================================
   API/HELPERS.PHP — Utilitaires communs API
   =================================================== */

session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';

function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function validateRequired(array $data, array $fields): ?string {
    foreach ($fields as $field) {
        if (empty(trim($data[$field] ?? ''))) {
            return "Le champ « {$field} » est requis.";
        }
    }
    return null;
}

function requireAuth(): array {
    if (empty($_SESSION['user'])) {
        jsonResponse(['success' => false, 'message' => 'Non authentifié.'], 401);
    }
    return $_SESSION['user'];
}

function requireRole(string ...$roles): array {
    $user = requireAuth();
    if (!in_array($user['role'], $roles)) {
        jsonResponse(['success' => false, 'message' => 'Accès non autorisé.'], 403);
    }
    return $user;
}

function sanitizeUser(array $user): array {
    unset($user['password']);
    return $user;
}
