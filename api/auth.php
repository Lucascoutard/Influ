<?php
/* ===================================================
   API/AUTH.PHP — Authentification (passkeys-only)
   POST ?action=logout
   GET  ?action=me
   GET  ?action=validate_invitation&token=TOKEN
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? '';

switch ($action) {

    // ======================== LOGOUT ========================
    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
        jsonResponse(['success' => true, 'message' => 'Logged out.']);
        break;

    // ======================== ME ========================
    case 'me':
        if (!empty($_SESSION['user'])) {
            $db   = getDB();
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

    // ======================== VALIDATE INVITATION ========================
    case 'validate_invitation':
        $token = trim($_GET['token'] ?? '');
        if (!$token) jsonResponse(['success' => false, 'message' => 'Token missing.'], 400);

        $db   = getDB();
        $stmt = $db->prepare(
            'SELECT id, firstname, lastname, email
             FROM users
             WHERE invitation_token = ? AND invitation_expires_at > NOW() AND is_active = 1'
        );
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user)
            jsonResponse(['success' => false, 'message' => 'Invalid or expired invitation link.'], 404);

        jsonResponse([
            'success'   => true,
            'firstname' => $user['firstname'],
            'lastname'  => $user['lastname'],
            'email'     => $user['email'],
        ]);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Unknown action.'], 400);
}
