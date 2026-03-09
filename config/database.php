<?php
/* ===================================================
   CONFIG/DATABASE.PHP — Connexion PDO (MySQL local)
   
   ⚠️  ADAPTE CES VALEURS À TON INSTALLATION :
   - XAMPP  : user = "root", pass = ""
   - WAMP   : user = "root", pass = ""
   - MAMP   : user = "root", pass = "root"
   =================================================== */

define('DB_HOST', 'localhost');
define('DB_NAME', 'influmatch');   // Nom de la base créée via le SQL
define('DB_USER', 'root');         // ← adapte si besoin
define('DB_PASS', '');             // ← adapte si besoin (MAMP = "root")
define('DB_CHARSET', 'utf8mb4');

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
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur de connexion BDD: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}
