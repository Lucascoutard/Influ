<?php
/* ===================================================
   CRON/CLEANUP.PHP — Politique de rétention des données
   RGPD Art. 5(1)(e) : limitation de la conservation

   Planification recommandée (crontab) :
     0 3 * * * php /chemin/vers/influmatch/cron/cleanup.php

   Règles appliquées :
   1. Inactif depuis 16 mois → email d'avertissement "désactivation dans 2 mois"
   2. Inactif depuis 18 mois → is_active = 0 (compte suspendu)
   3. Inactif depuis 22 mois → email d'avertissement "suppression dans 2 mois"
   4. Inactif depuis 24 mois → anonymisation des données personnelles
   =================================================== */

// Éviter l'exécution depuis un navigateur en prod
if (php_sapi_name() !== 'cli' && !isset($_GET['cron_key'])) {
    http_response_code(403);
    exit('Accès refusé.');
}

define('CRON_START', microtime(true));

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../api/mailer.php';

$db  = getDB();
$log = [];

$l = function (string $msg) use (&$log) {
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $msg;
    echo $line . PHP_EOL;
    $log[] = $line;
};

$l("=== Influmatch — Nettoyage RGPD démarré ===");

// ─────────────────────────────────────────────────────
// Helper : envoyer un email de prévention à un utilisateur
// ─────────────────────────────────────────────────────
function sendRetentionWarning(array $user, string $type): void {
    $firstname = $user['firstname'];
    $email     = $user['email'];
    $appUrl    = rtrim(APP_URL, '/');

    if ($type === 'deactivation') {
        $subject = 'Votre compte Influmatch sera désactivé dans 2 mois';
        $body = <<<HTML
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <tr><td style="background:linear-gradient(135deg,#5e4ad0,#7c6fe0);padding:28px 40px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#fff">Influmatch</div>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <h1 style="font-size:18px;color:#1a1a2e;margin:0 0 14px;font-weight:700">Votre compte sera désactivé bientôt</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 16px">Bonjour <strong>{$firstname}</strong>,</p>
          <p style="color:#555;line-height:1.65;margin:0 0 16px">
            Nous n'avons pas détecté de connexion à votre compte Influmatch depuis <strong>16 mois</strong>.<br>
            Conformément à notre politique de protection des données (RGPD), votre compte sera
            <strong>désactivé dans 2 mois</strong> si vous ne vous reconnectez pas.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$appUrl}/#login" style="display:inline-block;padding:13px 32px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none">
              Me reconnecter maintenant
            </a>
          </div>
          <p style="color:#888;font-size:12px;line-height:1.6;margin:0">
            Si vous souhaitez supprimer votre compte dès maintenant, connectez-vous et accédez à
            Compte → Sécurité → Zone de danger.
          </p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:16px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">© Influmatch — info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
HTML;
    } else {
        // anonymization warning
        $subject = 'Votre compte Influmatch sera supprimé dans 2 mois';
        $body = <<<HTML
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <tr><td style="background:linear-gradient(135deg,#b91c1c,#dc2626);padding:28px 40px;text-align:center">
          <div style="font-size:20px;font-weight:800;color:#fff">Influmatch</div>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <h1 style="font-size:18px;color:#1a1a2e;margin:0 0 14px;font-weight:700">⚠️ Suppression de votre compte dans 2 mois</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 16px">Bonjour <strong>{$firstname}</strong>,</p>
          <p style="color:#555;line-height:1.65;margin:0 0 16px">
            Votre compte Influmatch est inactif depuis <strong>22 mois</strong>. Conformément au RGPD
            (Art. 5 §1e — limitation de la conservation), vos données personnelles seront
            <strong>définitivement supprimées dans 2 mois</strong>.
          </p>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">
            Pour conserver votre compte, reconnectez-vous avant cette échéance.
          </p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$appUrl}/#login" style="display:inline-block;padding:13px 32px;background:#dc2626;color:#fff;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none">
              Sauvegarder mon compte
            </a>
          </div>
          <p style="color:#888;font-size:12px;line-height:1.6;margin:0">
            Vous pouvez aussi télécharger vos données avant suppression : Compte → Sécurité → "Télécharger mes données".
          </p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:16px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">© Influmatch — info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
HTML;
    }

    sendMail($email, $firstname, $subject, $body);
}

// ─────────────────────────────────────────────────────
// 1. Avertissement désactivation (inactif 16 mois)
//    On n'envoie qu'une fois : on marque avec warned_deactivation
// ─────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT id, firstname, email FROM users
    WHERE role            != 'admin'
      AND is_active       = 1
      AND email_verified  = 1
      AND last_login IS NOT NULL
      AND last_login < DATE_SUB(NOW(), INTERVAL 16 MONTH)
      AND last_login >= DATE_SUB(NOW(), INTERVAL 18 MONTH)
      AND (warned_deactivation IS NULL OR warned_deactivation = 0)
");
$stmt->execute();
$toWarnDeactivation = $stmt->fetchAll();

$warnedDeactivation = 0;
foreach ($toWarnDeactivation as $row) {
    sendRetentionWarning($row, 'deactivation');
    $db->prepare("UPDATE users SET warned_deactivation = 1 WHERE id = ?")->execute([$row['id']]);
    $warnedDeactivation++;
    $l("Email avertissement désactivation envoyé : {$row['email']}");
}
$l("Avertissements désactivation envoyés : {$warnedDeactivation}");

// ─────────────────────────────────────────────────────
// 2. Suspendre les comptes inactifs depuis 18 mois
// ─────────────────────────────────────────────────────
$stmt = $db->prepare("
    UPDATE users
    SET is_active = 0
    WHERE role           != 'admin'
      AND is_active      = 1
      AND email_verified = 1
      AND last_login IS NOT NULL
      AND last_login < DATE_SUB(NOW(), INTERVAL 18 MONTH)
");
$stmt->execute();
$suspended = $stmt->rowCount();
$l("Comptes suspendus (inactifs 18 mois) : {$suspended}");

// ─────────────────────────────────────────────────────
// 3. Avertissement suppression (inactif 22 mois)
// ─────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT id, firstname, email FROM users
    WHERE role           != 'admin'
      AND last_login IS NOT NULL
      AND last_login < DATE_SUB(NOW(), INTERVAL 22 MONTH)
      AND last_login >= DATE_SUB(NOW(), INTERVAL 24 MONTH)
      AND (warned_anonymization IS NULL OR warned_anonymization = 0)
");
$stmt->execute();
$toWarnAnonymization = $stmt->fetchAll();

$warnedAnonymization = 0;
foreach ($toWarnAnonymization as $row) {
    sendRetentionWarning($row, 'anonymization');
    $db->prepare("UPDATE users SET warned_anonymization = 1 WHERE id = ?")->execute([$row['id']]);
    $warnedAnonymization++;
    $l("Email avertissement suppression envoyé : {$row['email']}");
}
$l("Avertissements suppression envoyés : {$warnedAnonymization}");

// ─────────────────────────────────────────────────────
// 4. Anonymiser les comptes inactifs depuis 24 mois
// ─────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT id, email FROM users
    WHERE role         != 'admin'
      AND last_login IS NOT NULL
      AND last_login < DATE_SUB(NOW(), INTERVAL 24 MONTH)
");
$stmt->execute();
$toAnonymize = $stmt->fetchAll();

$anonymized = 0;
foreach ($toAnonymize as $row) {
    $uid      = (int)$row['id'];
    $anonMail = 'deleted_user_' . $uid . '@anonymized.invalid';

    // Supprimer l'avatar
    $avatarStmt = $db->prepare('SELECT avatar FROM users WHERE id = ?');
    $avatarStmt->execute([$uid]);
    $avatar = $avatarStmt->fetchColumn();
    if ($avatar) {
        $path = __DIR__ . '/../public/uploads/avatars/' . basename($avatar);
        if (file_exists($path)) @unlink($path);
    }

    // Anonymiser le profil
    $db->prepare("
        UPDATE users SET
            firstname            = 'Utilisateur',
            lastname             = 'Supprimé',
            email                = ?,
            password             = '',
            phone                = NULL,
            company              = NULL,
            avatar               = NULL,
            instagram            = NULL,
            tiktok               = NULL,
            youtube              = NULL,
            verification_token   = NULL,
            token_expires_at     = NULL,
            warned_deactivation  = 0,
            warned_anonymization = 0,
            is_active            = 0,
            email_verified       = 0
        WHERE id = ?
    ")->execute([$anonMail, $uid]);

    // Anonymiser les messages envoyés
    $db->prepare("UPDATE messages SET content = '[Message supprimé]' WHERE sender_id = ?")
       ->execute([$uid]);

    $anonymized++;
    $l("Compte anonymisé : uid={$uid} (anciennement {$row['email']})");
}
$l("Comptes anonymisés (inactifs 24 mois) : {$anonymized}");

// ─────────────────────────────────────────────────────
// 5. Supprimer les tokens de vérification expirés
// ─────────────────────────────────────────────────────
$stmt = $db->prepare("
    UPDATE users
    SET verification_token = NULL, token_expires_at = NULL
    WHERE token_expires_at IS NOT NULL
      AND token_expires_at < NOW()
      AND email_verified   = 0
");
$stmt->execute();
$cleanedTokens = $stmt->rowCount();
$l("Tokens de vérification expirés nettoyés : {$cleanedTokens}");

// ─────────────────────────────────────────────────────
// Rapport final
// ─────────────────────────────────────────────────────
$duration = round((microtime(true) - CRON_START) * 1000);
$l("=== Terminé en {$duration}ms ===");

$totalActions = $warnedDeactivation + $suspended + $warnedAnonymization + $anonymized;
if ($totalActions > 0) {
    $reportHtml = '<pre style="font-family:monospace;font-size:13px">' . implode("\n", $log) . '</pre>';
    sendMail(MAIL_FROM, 'Influmatch Admin', 'Rapport nettoyage RGPD — ' . date('Y-m-d'), $reportHtml);
}
