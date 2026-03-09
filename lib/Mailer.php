<?php
/* ===================================================
   LIB/MAILER.PHP — Envoi d'emails
   Utilise PHPMailer si installé via Composer,
   sinon fallback sur la fonction mail() native.

   Installation PHPMailer :
     composer install   (dans le dossier Influmatch)
   =================================================== */

require_once __DIR__ . '/../config/mail.php';

class Mailer
{
    // ── Point d'entrée ────────────────────────────────
    public static function send(
        string $to,
        string $toName,
        string $subject,
        string $html
    ): bool {
        $autoload = __DIR__ . '/../vendor/autoload.php';

        if (file_exists($autoload)) {
            return self::_sendSMTP($to, $toName, $subject, $html, $autoload);
        }
        return self::_sendNative($to, $toName, $subject, $html);
    }

    // ── SMTP via PHPMailer ────────────────────────────
    private static function _sendSMTP(
        string $to, string $toName, string $subject, string $html, string $autoload
    ): bool {
        require_once $autoload;
        try {
            $m = new PHPMailer\PHPMailer\PHPMailer(true);
            $m->isSMTP();
            $m->Host       = MAIL_SMTP_HOST;
            $m->SMTPAuth   = true;
            $m->AuthType   = 'LOGIN';
            $m->Username   = MAIL_SMTP_USER;
            $m->Password   = MAIL_SMTP_PASS;
            $m->SMTPSecure = MAIL_SMTP_SECURE;
            $m->Port       = MAIL_SMTP_PORT;
            $m->CharSet    = 'UTF-8';
            $m->setFrom(MAIL_FROM, MAIL_FROM_NAME);
            $m->addAddress($to, $toName);
            $m->isHTML(true);
            $m->Subject = $subject;
            $m->Body    = $html;
            $m->AltBody = strip_tags($html);
            $m->send();
            return true;
        } catch (\Exception $e) {
            error_log('[Mailer SMTP] ' . $e->getMessage());
            return false;
        }
    }

    // ── Fallback mail() native ────────────────────────
    private static function _sendNative(
        string $to, string $toName, string $subject, string $html
    ): bool {
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
        $headers = implode("\r\n", [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . MAIL_FROM_NAME . ' <' . MAIL_FROM . '>',
            'Reply-To: ' . MAIL_FROM,
            'X-Mailer: PHP/' . phpversion(),
        ]);
        return (bool) mail($to, $encodedSubject, $html, $headers);
    }

    // ================================================================
    //  TEMPLATES
    // ================================================================

    // ── Nouveau contrat à signer ──────────────────────
    public static function sendNewContract(
        string $email,
        string $name,
        string $contractTitle,
        string $description = ''
    ): bool {
        $url  = rtrim(APP_URL, '/') . '/#dashboard';
        $desc = $description
            ? '<p style="margin:0 0 16px;color:#555">' . nl2br(htmlspecialchars($description)) . '</p>'
            : '';
        $html = self::_wrap(
            'Nouveau contrat à signer',
            '<p style="margin:0 0 12px">Bonjour <strong>' . htmlspecialchars($name) . '</strong>,</p>
             <p style="margin:0 0 16px;color:#444">Un nouveau contrat vous a été transmis :</p>
             <div style="background:#f5f4f1;border-radius:10px;padding:14px 18px;margin-bottom:16px">
               <strong style="color:#1a1a2e">' . htmlspecialchars($contractTitle) . '</strong>
             </div>
             ' . $desc . '
             <p style="margin:0 0 20px;color:#444">Connectez-vous à votre espace pour le consulter et le signer.</p>',
            $url,
            'Accéder à mes contrats'
        );
        return self::send($email, $name, 'Nouveau contrat à signer — ' . $contractTitle, $html);
    }

    // ── Contrat signé (notification admin) ───────────
    public static function sendContractSigned(
        string $email,
        string $adminName,
        string $contractTitle,
        string $clientName
    ): bool {
        $url  = rtrim(APP_URL, '/') . '/#dashboard';
        $html = self::_wrap(
            'Contrat signé',
            '<p style="margin:0 0 12px">Bonjour <strong>' . htmlspecialchars($adminName) . '</strong>,</p>
             <p style="margin:0 0 16px;color:#444">
               Le client <strong>' . htmlspecialchars($clientName) . '</strong> vient de signer le contrat :
             </p>
             <div style="background:#dcfce7;border-radius:10px;padding:14px 18px;margin-bottom:20px">
               <strong style="color:#166534">' . htmlspecialchars($contractTitle) . '</strong>
             </div>',
            $url,
            'Voir les contrats'
        );
        return self::send($email, $adminName, 'Contrat signé — ' . $contractTitle, $html);
    }

    // ── Digest messages non lus ───────────────────────
    public static function sendMessageDigest(
        string $email,
        string $name,
        int    $count,
        array  $previews
    ): bool {
        $url    = rtrim(APP_URL, '/') . '/#dashboard';
        $plural = $count > 1 ? 'nouveaux messages' : 'nouveau message';
        $items  = array_map(
            fn($p) => '<li style="margin:4px 0;color:#555;font-size:14px">' . htmlspecialchars($p) . '</li>',
            array_slice($previews, 0, 5)
        );
        $html = self::_wrap(
            $count . ' ' . $plural . ' non lus',
            '<p style="margin:0 0 12px">Bonjour <strong>' . htmlspecialchars($name) . '</strong>,</p>
             <p style="margin:0 0 12px;color:#444">Vous avez <strong>' . $count . ' ' . $plural . '</strong> en attente sur Influmatch.</p>
             <ul style="padding-left:20px;margin:0 0 20px">' . implode('', $items) . '</ul>',
            $url,
            'Voir mes messages'
        );
        return self::send($email, $name, $count . ' ' . $plural . ' non lus — Influmatch', $html);
    }

    // ── Wrapper HTML commun ───────────────────────────
    private static function _wrap(
        string $heading,
        string $body,
        string $ctaUrl,
        string $ctaLabel
    ): string {
        return '<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f4f1;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f1;padding:32px 16px">
<tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);max-width:560px">
    <tr>
      <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:28px 36px">
        <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px">Influmatch</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 36px">
        <h2 style="margin:0 0 20px;color:#1a1a2e;font-size:20px;font-weight:700">' . $heading . '</h2>
        ' . $body . '
        <a href="' . $ctaUrl . '" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 26px;border-radius:9px;font-weight:600;font-size:14px">' . $ctaLabel . '</a>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 36px;border-top:1px solid #f0f0f0">
        <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6">
          Influmatch — Vous recevez cet email car vous êtes inscrit sur notre plateforme.<br>
          Pour toute question : <a href="mailto:' . MAIL_FROM . '" style="color:#7c3aed">' . MAIL_FROM . '</a>
        </p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>';
    }
}
