<?php
/* ===================================================
   API/MAILER.PHP - Send mail through Brevo API (v3)
   Uses config/mail.php for credentials
   =================================================== */

require_once __DIR__ . '/../config/mail.php';

/**
 * Sends an HTML email through Brevo API v3 (with automatic DKIM).
 * Returns true on success.
 */
function sendMail(string $to, string $toName, string $subject, string $htmlBody): bool {
    // Avoid fatal errors on misconfigured hosting env (missing constants)
    if (
        !defined('BREVO_API_KEY') || trim((string)BREVO_API_KEY) === '' ||
        !defined('MAIL_FROM') || trim((string)MAIL_FROM) === '' ||
        !defined('MAIL_FROM_NAME') || trim((string)MAIL_FROM_NAME) === ''
    ) {
        error_log('[Influmatch] Mail config missing: BREVO_API_KEY / MAIL_FROM / MAIL_FROM_NAME');
        return false;
    }

    $payload = json_encode([
        'sender'      => ['name' => MAIL_FROM_NAME, 'email' => MAIL_FROM],
        'to'          => [['email' => $to, 'name' => $toName]],
        'subject'     => $subject,
        'htmlContent' => $htmlBody,
    ]);

    // Primary transport: cURL (if available)
    if (function_exists('curl_init')) {
        $ch = curl_init('https://api.brevo.com/v3/smtp/email');
        if ($ch !== false) {
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'api-key: ' . BREVO_API_KEY,
                ],
                CURLOPT_TIMEOUT => 15,
                CURLOPT_SSL_VERIFYPEER => defined('APP_ENV') && APP_ENV === 'production',
                CURLOPT_SSL_VERIFYHOST => defined('APP_ENV') && APP_ENV === 'production' ? 2 : 0,
            ]);

            curl_exec($ch);
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            return $httpCode === 201;
        }
    }

    // Fallback transport: native HTTP stream (shared hosting safe)
    $headers = [
        'Content-Type: application/json',
        'api-key: ' . BREVO_API_KEY,
    ];

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers) . "\r\n",
            'content' => $payload,
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);

    $response = @file_get_contents('https://api.brevo.com/v3/smtp/email', false, $context);
    if ($response === false || empty($http_response_header)) {
        return false;
    }

    $statusLine = $http_response_header[0] ?? '';
    return strpos($statusLine, ' 201 ') !== false;
}

/**
 * HTML template for new client invitation.
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
          <h1 style="font-size:20px;color:#1a1a2e;margin:0 0 12px;font-weight:700">You've been invited</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">Hello <strong>{$firstname}</strong>,<br><br>
          Your Influmatch space is ready. Click the button below to set up your passkey and access your account - no password required.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$inviteUrl}" style="display:inline-block;padding:14px 36px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
              Set up my account ->
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;margin:0">This link is valid for <strong>7 days</strong>. If you have any questions, just reply to this email.</p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:18px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">&copy; 2025 Influmatch - info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

/**
 * HTML template for email verification.
 */
function mailTemplateVerification(string $firstname, string $verifyUrl): string {
    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Confirm your email address</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'DM Sans',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <tr><td style="background:linear-gradient(135deg,#5e4ad0,#7c6fe0);padding:32px 40px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">Influmatch</div>
          <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:2px">Smart Collabs. Real Impact.</div>
        </td></tr>
        <tr><td style="padding:40px 40px 32px">
          <h1 style="font-size:20px;color:#1a1a2e;margin:0 0 12px;font-weight:700">Confirm your email address</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">Hello <strong>{$firstname}</strong>,<br><br>
          Thanks for joining Influmatch. Click the button below to activate your account:</p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$verifyUrl}" style="display:inline-block;padding:14px 36px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
              Confirm my email
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;margin:0">This link is valid for <strong>24 hours</strong>. If you did not request this, you can safely ignore this email.</p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:18px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">&copy; 2025 Influmatch - info@contactinflumatch.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}

/**
 * HTML template for account registration confirmation.
 */
function mailTemplateRegistrationConfirmation(string $firstname): string {
    $dashboardUrl = rtrim(APP_URL, '/') . '/#espace';
    $safeName     = htmlspecialchars($firstname, ENT_QUOTES, 'UTF-8');
    $safeMail     = htmlspecialchars(MAIL_FROM, ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your account registration confirmation</title></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'DM Sans',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
        <tr><td style="background:linear-gradient(135deg,#5e4ad0,#7c6fe0);padding:32px 40px;text-align:center">
          <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-.5px">Influmatch</div>
          <div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:2px">Smart Collabs. Real Impact.</div>
        </td></tr>
        <tr><td style="padding:40px 40px 32px">
          <h1 style="font-size:20px;color:#1a1a2e;margin:0 0 12px;font-weight:700">Your account has been successfully registered</h1>
          <p style="color:#555;line-height:1.65;margin:0 0 24px">Hello <strong>{$safeName}</strong>,<br><br>
          Your Influmatch account has been created and activated successfully. You can now access your workspace.</p>
          <div style="text-align:center;margin:28px 0">
            <a href="{$dashboardUrl}" style="display:inline-block;padding:14px 36px;background:#5e4ad0;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
              Access my workspace
            </a>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.6;margin:0">If you have any questions, feel free to contact us at: <a href="mailto:{$safeMail}" style="color:#5e4ad0;text-decoration:none">{$safeMail}</a>.</p>
        </td></tr>
        <tr><td style="background:#f8f8fc;padding:18px 40px;text-align:center;border-top:1px solid #eee">
          <p style="font-size:11px;color:#aaa;margin:0">&copy; 2026 Influmatch - {$safeMail}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
HTML;
}
