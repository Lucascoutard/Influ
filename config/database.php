<?php
/* ===================================================
   CONFIG/DATABASE.PHP — Connexion PDO
   APP_ENV, DB_HOST, DB_NAME, DB_USER, DB_PASS
   sont définis dans config/secrets.php
   =================================================== */

require_once __DIR__ . '/secrets.php';

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log('[Influmatch] DB connection error: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Service temporarily unavailable. Please try again later.']);
            exit;
        }
    }
    return $pdo;
}
