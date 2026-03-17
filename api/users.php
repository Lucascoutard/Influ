<?php
/* ===================================================
   API/USERS.PHP — Gestion utilisateurs (admin only)
   GET  ?action=list   | PUT ?action=role
   PUT  ?action=toggle
   =================================================== */

require_once __DIR__ . '/helpers.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {

    case 'list':
        requireRole('admin');
        $db = getDB();
        $users = $db->query('SELECT id, firstname, lastname, email, role, phone, company, is_active, last_login, created_at FROM users ORDER BY created_at DESC')->fetchAll();
        jsonResponse(['success' => true, 'users' => $users]);
        break;

    case 'role':
        requireRole('admin');
        $data = getJsonBody();
        if (!in_array($data['role'] ?? '', ['admin', 'client', 'user', 'influencer', 'brand']))
            jsonResponse(['success' => false, 'message' => 'Rôle invalide.'], 422);
        $db = getDB();
        $db->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$data['role'], $data['user_id']]);
        jsonResponse(['success' => true, 'message' => 'Rôle mis à jour.']);
        break;

    case 'toggle':
        requireRole('admin');
        $data = getJsonBody();
        $db = getDB();
        $db->prepare('UPDATE users SET is_active = NOT is_active WHERE id = ?')->execute([$data['user_id']]);
        jsonResponse(['success' => true, 'message' => 'Statut mis à jour.']);
        break;

    case 'create':
        requireRole('admin');
        $data  = getJsonBody();
        $error = validateRequired($data, ['firstname', 'lastname', 'email', 'password']);
        if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

        $email = strtolower(trim($data['email']));
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            jsonResponse(['success' => false, 'message' => 'Email invalide.'], 422);
        if (strlen($data['password']) < 8)
            jsonResponse(['success' => false, 'message' => 'Le mot de passe doit contenir au moins 8 caractères.'], 422);

        $db = getDB();
        $check = $db->prepare('SELECT id FROM users WHERE email = ?');
        $check->execute([$email]);
        if ($check->fetch())
            jsonResponse(['success' => false, 'message' => 'Cet e-mail est déjà utilisé.'], 409);

        $role = in_array($data['role'] ?? '', ['admin','client','user','influencer','brand']) ? $data['role'] : 'client';
        $hash = password_hash($data['password'], PASSWORD_BCRYPT);
        $db->prepare('INSERT INTO users (firstname, lastname, email, password, role, phone, company, is_active) VALUES (?,?,?,?,?,?,?,1)')
           ->execute([
               trim($data['firstname']), trim($data['lastname']),
               $email, $hash, $role,
               trim($data['phone'] ?? ''), trim($data['company'] ?? '')
           ]);
        $newId = $db->lastInsertId();
        $stmt  = $db->prepare('SELECT id, firstname, lastname, email, role, phone, company, is_active, last_login, created_at FROM users WHERE id = ?');
        $stmt->execute([$newId]);
        jsonResponse(['success' => true, 'message' => 'Compte créé.', 'user' => $stmt->fetch()], 201);
        break;

    case 'delete':
        requireRole('admin');
        $admin = requireRole('admin');
        $data  = getJsonBody();
        $uid   = (int)($data['user_id'] ?? 0);
        if (!$uid) jsonResponse(['success' => false, 'message' => 'Utilisateur invalide.'], 422);
        if ($uid === (int)$admin['id'])
            jsonResponse(['success' => false, 'message' => 'Impossible de supprimer votre propre compte.'], 403);
        $db = getDB();
        $db->prepare('DELETE FROM users WHERE id = ?')->execute([$uid]);
        jsonResponse(['success' => true, 'message' => 'Compte supprimé.']);
        break;

    case 'change_password':
        $user = requireAuth();
        $data = getJsonBody();
        if (empty($data['current_password']) || empty($data['new_password']))
            jsonResponse(['success' => false, 'message' => 'Champs requis.'], 422);
        if (strlen($data['new_password']) < 8)
            jsonResponse(['success' => false, 'message' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.'], 422);
        $db = getDB();
        $stmt = $db->prepare('SELECT password FROM users WHERE id = ?');
        $stmt->execute([(int)$user['id']]);
        $row = $stmt->fetch();
        if (!$row || !password_verify($data['current_password'], $row['password']))
            jsonResponse(['success' => false, 'message' => 'Mot de passe actuel incorrect.'], 401);
        $hash = password_hash($data['new_password'], PASSWORD_BCRYPT);
        $db->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([$hash, (int)$user['id']]);
        jsonResponse(['success' => true, 'message' => 'Mot de passe mis à jour.']);
        break;

    case 'update_profile':
        $user = requireAuth();
        $data = getJsonBody();
        $db   = getDB();
        $db->prepare('UPDATE users SET phone = ?, company = ? WHERE id = ?')
           ->execute([
               trim($data['phone']   ?? ''),
               trim($data['company'] ?? ''),
               (int)$user['id'],
           ]);
        $_SESSION['user']['phone']   = trim($data['phone']   ?? '');
        $_SESSION['user']['company'] = trim($data['company'] ?? '');
        jsonResponse(['success' => true, 'message' => 'Profil mis à jour.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Action inconnue.'], 400);
}
