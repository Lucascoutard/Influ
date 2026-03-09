<?php
/* ===================================================
   API/AUTH.PHP — Authentification
   POST ?action=register | POST ?action=login
   POST ?action=logout   | GET  ?action=me
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? '';

switch ($action) {

    // ======================== REGISTER ========================
    case 'register':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST')
            jsonResponse(['success' => false, 'message' => 'Méthode non autorisée.'], 405);

        $data = getJsonBody();
        $error = validateRequired($data, ['firstname', 'lastname', 'email', 'password']);
        if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

        $firstname = trim($data['firstname']);
        $lastname  = trim($data['lastname']);
        $email     = strtolower(trim($data['email']));
        $password  = $data['password'];
        $phone     = trim($data['phone'] ?? '');
        $company   = trim($data['company'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            jsonResponse(['success' => false, 'message' => 'Email invalide.'], 422);

        if (strlen($password) < 8)
            jsonResponse(['success' => false, 'message' => 'Le mot de passe doit contenir au moins 8 caractères.'], 422);

        $db = getDB();

        $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch())
            jsonResponse(['success' => false, 'message' => 'Cet email est déjà utilisé.'], 409);

        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $db->prepare('INSERT INTO users (firstname, lastname, email, password, role, phone, company) VALUES (?, ?, ?, ?, "user", ?, ?)');
        $stmt->execute([$firstname, $lastname, $email, $hash, $phone, $company]);

        $userId = $db->lastInsertId();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        $_SESSION['user'] = sanitizeUser($user);
        $db->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$userId]);

        jsonResponse(['success' => true, 'message' => 'Compte créé !', 'user' => sanitizeUser($user)], 201);
        break;

    // ======================== LOGIN ========================
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST')
            jsonResponse(['success' => false, 'message' => 'Méthode non autorisée.'], 405);

        $data = getJsonBody();
        $error = validateRequired($data, ['email', 'password']);
        if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

        $email    = strtolower(trim($data['email']));
        $password = $data['password'];

        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND is_active = 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password']))
            jsonResponse(['success' => false, 'message' => 'Email ou mot de passe incorrect.'], 401);

        $_SESSION['user'] = sanitizeUser($user);
        $db->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);

        jsonResponse(['success' => true, 'message' => 'Connexion réussie.', 'user' => sanitizeUser($user)]);
        break;

    // ======================== LOGOUT ========================
    case 'logout':
        session_destroy();
        jsonResponse(['success' => true, 'message' => 'Déconnexion réussie.']);
        break;

    // ======================== ME ========================
    case 'me':
        if (!empty($_SESSION['user'])) {
            $db = getDB();
            $stmt = $db->prepare('SELECT * FROM users WHERE id = ? AND is_active = 1');
            $stmt->execute([$_SESSION['user']['id']]);
            $user = $stmt->fetch();
            if ($user) {
                $_SESSION['user'] = sanitizeUser($user);
                jsonResponse(['success' => true, 'user' => sanitizeUser($user)]);
            }
        }
        jsonResponse(['success' => false, 'user' => null]);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Action inconnue.'], 400);
}
