<?php
/* ===================================================
   API/USERS.PHP — Gestion utilisateurs
   GET  ?action=list           (admin)
   PUT  ?action=role           (admin)
   PUT  ?action=toggle         (admin)
   POST ?action=create         (admin) — invitation-based
   POST ?action=resend_invite  (admin)
   PUT  ?action=delete         (admin)
   POST ?action=update_profile (auth)
   POST ?action=upload_avatar  (auth)
   POST ?action=delete_avatar  (auth)
   POST ?action=export_data    (auth)
   POST ?action=delete_account (auth)
   =================================================== */

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/mailer.php';

$action = $_GET['action'] ?? 'list';

switch ($action) {

    // ======================== LIST ========================
    case 'list':
        requireRole('admin');
        $db    = getDB();
        $users = $db->query(
            'SELECT u.id, u.firstname, u.lastname, u.email, u.role,
                    u.phone, u.company, u.is_active, u.last_login, u.created_at,
                    (u.invitation_token IS NOT NULL) AS is_invited,
                    (SELECT COUNT(*) FROM passkey_credentials WHERE user_id = u.id) AS passkey_count
             FROM users u
             ORDER BY u.created_at DESC'
        )->fetchAll();
        jsonResponse(['success' => true, 'users' => $users]);
        break;

    // ======================== ROLE ========================
    case 'role':
        requireRole('admin');
        $data = getJsonBody();
        if (!in_array($data['role'] ?? '', ['admin', 'client', 'influencer', 'brand']))
            jsonResponse(['success' => false, 'message' => 'Invalid role.'], 422);
        $db = getDB();
        $db->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$data['role'], $data['user_id']]);
        jsonResponse(['success' => true, 'message' => 'Role updated.']);
        break;

    // ======================== TOGGLE ========================
    case 'toggle':
        requireRole('admin');
        $data = getJsonBody();
        $db   = getDB();
        $db->prepare('UPDATE users SET is_active = NOT is_active WHERE id = ?')->execute([$data['user_id']]);
        jsonResponse(['success' => true, 'message' => 'Status updated.']);
        break;

    // ======================== CREATE (invitation) ========================
    case 'create':
        requireRole('admin');
        $data  = getJsonBody();
        $error = validateRequired($data, ['firstname', 'lastname', 'email']);
        if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

        $firstname = trim($data['firstname']);
        $lastname  = trim($data['lastname']);
        $email     = strtolower(trim($data['email']));
        $phone     = trim($data['phone']    ?? '');
        $company   = trim($data['company']  ?? '');
        $role      = in_array($data['role'] ?? '', ['admin', 'client', 'influencer', 'brand'])
                     ? $data['role'] : 'client';

        if (!maxLength($firstname, 100) || !maxLength($lastname, 100))
            jsonResponse(['success' => false, 'message' => 'Name too long.'], 422);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !maxLength($email, 254))
            jsonResponse(['success' => false, 'message' => 'Invalid email.'], 422);

        $db    = getDB();
        $check = $db->prepare('SELECT id FROM users WHERE email = ?');
        $check->execute([$email]);
        if ($check->fetch())
            jsonResponse(['success' => false, 'message' => 'This email is already in use.'], 409);

        // Generate invitation token (7-day expiry)
        $token   = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

        $db->prepare(
            'INSERT INTO users
             (firstname, lastname, email, password, role, phone, company,
              is_active, email_verified, invitation_token, invitation_expires_at)
             VALUES (?,?,?,NULL,?,?,?,1,1,?,?)'
        )->execute([$firstname, $lastname, $email, $role, $phone, $company, $token, $expires]);

        $newId = $db->lastInsertId();

        // Send invitation email
        $inviteUrl = rtrim(APP_URL, '/') . '/?invite=' . urlencode($token) . '#setup-passkey';
        $html      = mailTemplateInvitation($firstname, $inviteUrl);
        sendMail($email, $firstname . ' ' . $lastname, 'You\'re invited to Influmatch', $html);

        $stmt = $db->prepare(
            'SELECT id, firstname, lastname, email, role, phone, company,
                    is_active, last_login, created_at,
                    1 AS is_invited, 0 AS passkey_count
             FROM users WHERE id = ?'
        );
        $stmt->execute([$newId]);
        jsonResponse(['success' => true, 'message' => 'Invitation sent.', 'user' => $stmt->fetch()], 201);
        break;

    // ======================== RESEND INVITE ========================
    case 'resend_invite':
        requireRole('admin');
        $data = getJsonBody();
        $uid  = (int)($data['user_id'] ?? 0);
        if (!$uid) jsonResponse(['success' => false, 'message' => 'Invalid user.'], 422);

        $db   = getDB();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ? AND invitation_token IS NOT NULL AND is_active = 1');
        $stmt->execute([$uid]);
        $user = $stmt->fetch();
        if (!$user)
            jsonResponse(['success' => false, 'message' => 'User not found or already active.'], 404);

        $token   = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+7 days'));
        $db->prepare('UPDATE users SET invitation_token = ?, invitation_expires_at = ? WHERE id = ?')
           ->execute([$token, $expires, $uid]);

        $inviteUrl = rtrim(APP_URL, '/') . '/?invite=' . urlencode($token) . '#setup-passkey';
        $html      = mailTemplateInvitation($user['firstname'], $inviteUrl);
        sendMail($user['email'], $user['firstname'] . ' ' . $user['lastname'],
                 'You\'re invited to Influmatch', $html);

        jsonResponse(['success' => true, 'message' => 'Invitation resent.']);
        break;

    // ======================== DELETE (admin) ========================
    case 'delete':
        $admin = requireRole('admin');
        $data  = getJsonBody();
        $uid   = (int)($data['user_id'] ?? 0);
        if (!$uid) jsonResponse(['success' => false, 'message' => 'Invalid user.'], 422);
        if ($uid === (int)$admin['id'])
            jsonResponse(['success' => false, 'message' => 'Cannot delete your own account.'], 403);
        $db = getDB();
        $db->prepare('DELETE FROM users WHERE id = ?')->execute([$uid]);
        jsonResponse(['success' => true, 'message' => 'Account deleted.']);
        break;

    // ======================== UPDATE PROFILE ========================
    case 'update_profile':
        $user = requireAuth();
        $data = getJsonBody();
        $db   = getDB();

        $firstname = trim($data['firstname'] ?? '');
        $lastname  = trim($data['lastname']  ?? '');
        $email     = strtolower(trim($data['email'] ?? ''));
        $phone     = trim($data['phone']     ?? '');
        $company   = trim($data['company']   ?? '');
        $instagram = trim($data['instagram'] ?? '');
        $tiktok    = trim($data['tiktok']    ?? '');
        $youtube   = trim($data['youtube']   ?? '');

        if (!$firstname || !$lastname)
            jsonResponse(['success' => false, 'message' => 'First and last name required.'], 422);
        if (!maxLength($firstname, 100) || !maxLength($lastname, 100))
            jsonResponse(['success' => false, 'message' => 'Name too long.'], 422);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !maxLength($email, 254))
            jsonResponse(['success' => false, 'message' => 'Invalid email.'], 422);
        if (!maxLength($phone, 20) || !maxLength($company, 200))
            jsonResponse(['success' => false, 'message' => 'Field too long.'], 422);
        if (!maxLength($instagram, 100) || !maxLength($tiktok, 100) || !maxLength($youtube, 200))
            jsonResponse(['success' => false, 'message' => 'Social handle too long.'], 422);

        $check = $db->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $check->execute([$email, (int)$user['id']]);
        if ($check->fetch())
            jsonResponse(['success' => false, 'message' => 'Email already in use by another account.'], 409);

        $db->prepare(
            'UPDATE users SET firstname=?, lastname=?, email=?, phone=?, company=?, instagram=?, tiktok=?, youtube=? WHERE id=?'
        )->execute([$firstname, $lastname, $email, $phone, $company, $instagram, $tiktok, $youtube, (int)$user['id']]);

        $_SESSION['user']['firstname'] = $firstname;
        $_SESSION['user']['lastname']  = $lastname;
        $_SESSION['user']['email']     = $email;
        $_SESSION['user']['phone']     = $phone;
        $_SESSION['user']['company']   = $company;
        $_SESSION['user']['instagram'] = $instagram;
        $_SESSION['user']['tiktok']    = $tiktok;
        $_SESSION['user']['youtube']   = $youtube;

        jsonResponse(['success' => true, 'message' => 'Profile updated.', 'user' => [
            'firstname' => $firstname, 'lastname'  => $lastname,
            'email'     => $email,    'phone'     => $phone,
            'company'   => $company,  'instagram' => $instagram,
            'tiktok'    => $tiktok,   'youtube'   => $youtube,
        ]]);
        break;

    // ======================== UPLOAD AVATAR ========================
    case 'upload_avatar':
        $user = requireAuth();
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_FILES['avatar']))
            jsonResponse(['success' => false, 'message' => 'No file received.'], 422);

        $file    = $_FILES['avatar'];
        $maxSize = 5 * 1024 * 1024;

        if ($file['error'] !== UPLOAD_ERR_OK)
            jsonResponse(['success' => false, 'message' => 'Upload error.'], 422);
        if ($file['size'] > $maxSize)
            jsonResponse(['success' => false, 'message' => 'File too large (5 MB max).'], 422);

        $finfo    = new finfo(FILEINFO_MIME_TYPE);
        $realMime = $finfo->file($file['tmp_name']);
        $mimeToExt = [
            'image/jpeg' => 'jpg', 'image/png'  => 'png',
            'image/gif'  => 'gif', 'image/webp' => 'webp',
        ];
        if (!isset($mimeToExt[$realMime]))
            jsonResponse(['success' => false, 'message' => 'Unsupported format (jpg, png, gif, webp only).'], 422);

        $ext      = $mimeToExt[$realMime];
        $uid      = (int)$user['id'];
        $dir      = __DIR__ . '/../public/uploads/avatars/';
        $filename = $uid . '_' . time() . '.' . $ext;
        $dest     = $dir . $filename;

        $db   = getDB();
        $stmt = $db->prepare('SELECT avatar FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $old  = $stmt->fetchColumn();
        if ($old && file_exists($dir . basename($old))) @unlink($dir . basename($old));

        if (!move_uploaded_file($file['tmp_name'], $dest))
            jsonResponse(['success' => false, 'message' => 'Could not save file.'], 500);

        $avatarUrl = 'public/uploads/avatars/' . $filename;
        $db->prepare('UPDATE users SET avatar = ? WHERE id = ?')->execute([$avatarUrl, $uid]);
        $_SESSION['user']['avatar'] = $avatarUrl;

        jsonResponse(['success' => true, 'avatar' => $avatarUrl]);
        break;

    // ======================== DELETE AVATAR ========================
    case 'delete_avatar':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $db   = getDB();
        $stmt = $db->prepare('SELECT avatar FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $old  = $stmt->fetchColumn();
        $dir  = __DIR__ . '/../public/uploads/avatars/';
        if ($old && file_exists($dir . basename($old))) @unlink($dir . basename($old));
        $db->prepare('UPDATE users SET avatar = NULL WHERE id = ?')->execute([$uid]);
        $_SESSION['user']['avatar'] = null;
        jsonResponse(['success' => true]);
        break;

    // ======================== EXPORT DATA ========================
    case 'export_data':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $db   = getDB();

        $stmt = $db->prepare('SELECT id, firstname, lastname, email, role, phone, company, instagram, tiktok, youtube, avatar, created_at, last_login FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $profile = $stmt->fetch();

        $stmt = $db->prepare('SELECT id, title, status, budget, start_date, end_date, description, created_at FROM collaborations WHERE brand_id = ? OR influencer_id = ? ORDER BY created_at DESC');
        $stmt->execute([$uid, $uid]);
        $collabs = $stmt->fetchAll();

        $stmt = $db->prepare('SELECT m.id, m.content, m.type, m.created_at, c.name AS conversation FROM messages m JOIN conversations c ON c.id = m.conversation_id WHERE m.sender_id = ? ORDER BY m.created_at DESC LIMIT 500');
        $stmt->execute([$uid]);
        $messages = $stmt->fetchAll();

        $export = [
            'export_date'    => date('c'),
            'generated_by'   => 'Influmatch — GDPR Art. 20 / CCPA Data Portability',
            'profile'        => $profile,
            'collaborations' => $collabs,
            'messages_sent'  => $messages,
        ];

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="influmatch-my-data-' . date('Y-m-d') . '.json"');
        echo json_encode($export, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;

    // ======================== DELETE ACCOUNT ========================
    case 'delete_account':
        $user = requireAuth();
        $uid  = (int)$user['id'];
        $db   = getDB();

        // Delete avatar file
        $stmt = $db->prepare('SELECT avatar FROM users WHERE id = ?');
        $stmt->execute([$uid]);
        $avatar = $stmt->fetchColumn();
        if ($avatar) {
            $dir  = __DIR__ . '/../public/uploads/avatars/';
            $file = $dir . basename($avatar);
            if (file_exists($file)) @unlink($file);
        }

        $db->prepare('DELETE FROM users WHERE id = ?')->execute([$uid]);

        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();

        jsonResponse(['success' => true, 'message' => 'Account deleted.']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Unknown action.'], 400);
}
