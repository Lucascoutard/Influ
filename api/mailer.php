<?php
/* ===================================================
   API/MAILER.PHP — Envoi SMTP (Brevo / fallback mail())
   Utilise config/mail.php pour les credentials
   =================================================== */

require_once __DIR__ . '/../config/mail.php';

/**
 * Envoie un email HTML via SMTP (TLS/SSL) ou PHP mail() en fallback.
 * Retourne true si envoi réussi.
 */
function sendMail(string $to, string $toName, string $subject, string $htmlBody): bool {

    // ── Fallback : PHP mail() natif si pas de credentials SMTP ──
    if (!MAIL_SMTP_USER || !MAIL_SMTP_PASS) {
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=utf-8\r\n";
        $headers .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
        return @mail($to, $subject, $htmlBody, $headers);
    }

    // ── Connexion SMTP ──
    $host   = MAIL_SMTP_HOST;
    $port   = MAIL_SMTP_PORT;
    $secure = MAIL_SMTP_SECURE;
    $prefix = ($secure === 'ssl') ? 'ssl' : 'tcp';

    $ctx  = stream_context_create(['ssl' => [
        'verify_peer'      => false,
        'verify_peer_name' => false,
    ]]);
    $smtp = @stream_socket_client(
        "{$prefix}://{$host}:{$port}", $errno, $errstr, 15,
        STREAM_CLIENT_CONNECT, $ctx
    );
    if (!$smtp) return false;

    $r = function () use ($smtp) { return fgets($smtp, 512); };
    $w = function (string $cmd) use ($smtp) { fwrite($smtp, $cmd . "\r\n"); };

    $r(); // 220 greeting

    $w("EHLO " . (gethostname() ?: 'localhost'));
    do { $line = $r(); } while ($line && substr($line, 3, 1) === '-');

    // STARTTLS si mode tls
    if ($secure === 'tls') {
        $w("STARTTLS");
        $r(); // 220 ready
        stream_socket_enable_crypto($smtp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $w("EHLO " . (gethostname() ?: 'localhost'));
        do { $line = $r(); } while ($line && substr($line, 3, 1) === '-');
    }

    // AUTH LOGIN
    $w("AUTH LOGIN");
    $r(); // 334
    $w(base64_encode(MAIL_SMTP_USER));
    $r(); // 334
    $w(base64_encode(MAIL_SMTP_PASS));
    $auth = $r(); // 235 ou erreur
    if (substr(trim($auth), 0, 3) !== '235') {
        fclose($smtp);
        return false;
    }

    $w("MAIL FROM:<" . MAIL_FROM . ">");
    $r(); // 250
    $w("RCPT TO:<{$to}>");
    $r(); // 250
    $w("DATA");
    $r(); // 354

    $nameSafe = "=?UTF-8?B?" . base64_encode($toName)     . "?=";
    $fromSafe = "=?UTF-8?B?" . base64_encode(MAIL_FROM_NAME) . "?=";
    $subjSafe = "=?UTF-8?B?" . base64_encode($subject)    . "?=";

    $body  = "From: {$fromSafe} <" . MAIL_FROM . ">\r\n";
    $body .= "To: {$nameSafe} <{$to}>\r\n";
    $body .= "Subject: {$subjSafe}\r\n";
    $body .= "MIME-Version: 1.0\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= "\r\n" . chunk_split(base64_encode($htmlBody)) . "\r\n.";

    fwrite($smtp, $body . "\r\n");
    $resp = $r(); // 250
    $w("QUIT");
    fclose($smtp);

    return substr(trim($resp), 0, 3) === '250';
}

/**
 * Template HTML pour invitation d'un nouveau client.
 */
function mailTemplateInvitation(string $firstname, string $inviteUrl): string {
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>You're invited to Influmatch</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'DM Sans',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <tr><td style="background:linear-gradient(135deg,#5e4ad0,#7c6fe0);padding:32px 40px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">Influmatch</div>
          <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:2px">Smart Collabs. Real Impact.</div>
        </td></tr>
        <tr><td style="padding:40px 40px 32px">
          <h1 style="font-size:20px;color:#1a1a2e;margin:0 0 12px;font-weight:700">You've been invited 🎉</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">Hello <strong>{$firstname}</strong>,<br><br>
          Your Influmatch space is ready. Click the button below to set up your passkey and access your account — no password required.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$inviteUrl}" style="display:inline-block;padding:14px 36px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
              Set up my account →
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;margin:0">This link is valid for <strong>7 days</strong>. If you have any questions, just reply to this email.</p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:18px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">© 2025 Influmatch — info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Template HTML pour email de vérification.
 */
function mailTemplateVerification(string $firstname, string $verifyUrl): string {
    return <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Confirmez votre adresse email</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'DM Sans',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#5e4ad0,#7c6fe0);padding:32px 40px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">Influmatch</div>
          <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:2px">Smart Collabs. Real Impact.</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 40px 32px">
          <h1 style="font-size:20px;color:#1a1a2e;margin:0 0 12px;font-weight:700">Confirmez votre adresse email</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">Bonjour <strong>{$firstname}</strong>,<br><br>
          Merci de votre inscription sur Influmatch. Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$verifyUrl}" style="display:inline-block;padding:14px 36px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
              Confirmer mon email
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;margin:0">Ce lien est valable <strong>24 heures</strong>. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f8fc;padding:18px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">© 2025 Influmatch — info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
