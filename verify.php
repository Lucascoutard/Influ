<?php
/* ===================================================
   VERIFY.PHP — Confirmation email (double opt-in)
   Accès : /verify.php?token=XXXX
   Vérifie le token, crée la session, redirige vers l'app
   =================================================== */

require_once __DIR__ . '/api/helpers.php';
require_once __DIR__ . '/config/mail.php';

// Forcer HTML (overrider le Content-Type JSON de helpers.php)
header('Content-Type: text/html; charset=utf-8');

$token = trim($_GET['token'] ?? '');

if (!$token) {
    header('Location: ' . APP_URL . '/');
    exit;
}

$db   = getDB();
$stmt = $db->prepare('
    SELECT * FROM users
    WHERE verification_token = ?
      AND token_expires_at > NOW()
      AND email_verified = 0
      AND is_active = 1
');
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    // Token invalide ou expiré — page d'erreur minimaliste
    echo <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Lien invalide — Influmatch</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center;
           min-height: 100vh; margin: 0; background: #f4f4f8; }
    .box { background: #fff; border-radius: 16px; padding: 40px; max-width: 420px; text-align: center;
           box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    h1 { color: #dc2626; font-size: 1.3rem; margin-bottom: 12px; }
    p  { color: #555; font-size: .9rem; line-height: 1.6; }
    a  { color: #5e4ad0; font-weight: 600; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Lien invalide ou expiré</h1>
    <p>Ce lien de confirmation n'est plus valide (il expire après 24 h).<br>
    Connectez-vous pour en demander un nouveau.</p>
    <p><a href="javascript:history.back()">Retour</a> · <a href="/">Accueil</a></p>
  </div>
</body>
</html>
HTML;
    exit;
}

// ── Valider le compte ──
$db->prepare('
    UPDATE users
    SET email_verified     = 1,
        verification_token = NULL,
        token_expires_at   = NULL,
        last_login         = NOW()
    WHERE id = ?
')->execute([$user['id']]);

$user['email_verified']     = 1;
$user['verification_token'] = null;

$_SESSION['user'] = sanitizeUser($user);

// Rediriger vers l'espace client
header('Location: ' . APP_URL . '/#espace');
exit;
