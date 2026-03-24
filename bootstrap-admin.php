<?php
/**
 * ADMIN PASSKEY BOOTSTRAP — One-time use
 * Generates an invitation link for the admin account so they can set up a passkey.
 * DELETE this file immediately after use.
 *
 * Only accessible from localhost for security.
 */

// Block all non-localhost access
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if (!in_array($ip, ['127.0.0.1', '::1', 'localhost'])) {
    http_response_code(403);
    die('Access denied.');
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/mail.php';

$db = getDB();

// Find admin account
$stmt = $db->query("SELECT id, firstname, lastname, email FROM users WHERE role = 'admin' ORDER BY id ASC");
$admins = $stmt->fetchAll();

if (empty($admins)) {
    die('No admin account found.');
}

// Process form
$generated = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uid   = (int)$_POST['uid'];
    $token = bin2hex(random_bytes(32));
    $exp   = date('Y-m-d H:i:s', strtotime('+24 hours'));

    $db->prepare('UPDATE users SET invitation_token = ?, invitation_expires_at = ? WHERE id = ?')
       ->execute([$token, $exp, $uid]);

    $base = rtrim(APP_URL, '/');
    $generated = $base . '/?invite=' . urlencode($token) . '#setup-passkey';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Passkey Bootstrap</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 60px auto; padding: 0 24px; color: #1a1a2e; }
    h1 { font-size: 1.3rem; margin-bottom: 4px; }
    p  { color: #555; font-size: .9rem; line-height: 1.6; }
    .warning { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px 16px; font-size: .85rem; color: #92400e; margin-bottom: 24px; }
    select, button { padding: 10px 16px; font-size: .9rem; border-radius: 8px; border: 1.5px solid #d1d5db; }
    button { background: #5e4ad0; color: #fff; border-color: #5e4ad0; cursor: pointer; margin-left: 8px; }
    .link-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 14px 16px; word-break: break-all; font-family: monospace; font-size: .85rem; margin-top: 16px; }
    .success { color: #166534; background: #dcfce7; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; font-size: .88rem; }
  </style>
</head>
<body>
  <h1>🔑 Admin Passkey Bootstrap</h1>
  <p>Generate a one-time invitation link to set up a passkey for an admin account.</p>

  <div class="warning">
    ⚠️ <strong>Delete this file immediately after use.</strong> It bypasses authentication.
  </div>

  <?php if ($generated): ?>
    <div class="success">✅ Invitation link generated (valid 24 hours).</div>
    <p><strong>Open this URL in your browser:</strong></p>
    <div class="link-box">
      <a href="<?= htmlspecialchars($generated) ?>"><?= htmlspecialchars($generated) ?></a>
    </div>
    <p style="margin-top:16px;font-size:.83rem;color:#dc2626">
      👆 Click the link above, set up your passkey, then <strong>delete this file</strong>.
    </p>
  <?php else: ?>
    <form method="POST">
      <label style="display:block;margin-bottom:8px;font-size:.85rem;font-weight:600">Select admin account:</label>
      <select name="uid">
        <?php foreach ($admins as $a): ?>
          <option value="<?= $a['id'] ?>">
            <?= htmlspecialchars($a['firstname'] . ' ' . $a['lastname']) ?> — <?= htmlspecialchars($a['email']) ?>
          </option>
        <?php endforeach; ?>
      </select>
      <button type="submit">Generate link</button>
    </form>
  <?php endif; ?>
</body>
</html>
