<?php
/* ===================================================
   API/HELPERS.PHP — Utilitaires communs API
   =================================================== */

session_start();

// ── Security headers (OWASP A05 — Security Misconfiguration) ──
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// ── CORS — restrict to same origin, no wildcard (OWASP A05) ──
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost',
    'http://localhost:80',
    'http://127.0.0.1',
    'https://influmatch.fr',
    'https://www.influmatch.fr',
];
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';

// ── Rate limiting — file-based, IP-keyed (OWASP A07) ──
function rateLimit(string $key, int $maxAttempts = 10, int $windowSeconds = 900): void {
    $ip   = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    // Only use first IP if behind proxy (prevent header spoofing)
    $ip   = trim(explode(',', $ip)[0]);
    $file = sys_get_temp_dir() . '/im_rl_' . md5($key . $ip) . '.json';
    $now  = time();

    $data = file_exists($file) ? @json_decode(file_get_contents($file), true) : null;
    if (!is_array($data) || ($now - ($data['first'] ?? 0)) > $windowSeconds) {
        $data = ['count' => 0, 'first' => $now];
    }

    if ($data['count'] >= $maxAttempts) {
        $wait = $windowSeconds - ($now - $data['first']);
        jsonResponse(['success' => false, 'message' => 'Too many attempts. Try again in ' . ceil($wait / 60) . ' min.'], 429);
    }

    $data['count']++;
    file_put_contents($file, json_encode($data), LOCK_EX);
}

function rateLimitReset(string $key): void {
    $ip   = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ip   = trim(explode(',', $ip)[0]);
    $file = sys_get_temp_dir() . '/im_rl_' . md5($key . $ip) . '.json';
    @unlink($file);
}

// ── Response helper ──
function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ── Input validation ──
function validateRequired(array $data, array $fields): ?string {
    foreach ($fields as $field) {
        if (empty(trim((string)($data[$field] ?? '')))) {
            return "Field \"{$field}\" is required.";
        }
    }
    return null;
}

function maxLength(string $value, int $max): bool {
    return mb_strlen($value) <= $max;
}

// ── Auth helpers ──
function requireAuth(): array {
    if (empty($_SESSION['user'])) {
        jsonResponse(['success' => false, 'message' => 'Unauthenticated.'], 401);
    }
    return $_SESSION['user'];
}

function requireRole(string ...$roles): array {
    $user = requireAuth();
    if (!in_array($user['role'], $roles, true)) {
        jsonResponse(['success' => false, 'message' => 'Access denied.'], 403);
    }
    return $user;
}

function sanitizeUser(array $user): array {
    unset($user['password'], $user['verification_token']);
    return $user;
}
