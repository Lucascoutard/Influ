<?php
/* ===================================================
   CONFIG/MAIL.PHP — Configuration SMTP
   ⚠️  Remplis avec tes vraies credentials SMTP

   Options populaires :
   - Gmail (app password) : smtp.gmail.com / 587 / tls
   - Brevo (Sendinblue)   : smtp-relay.brevo.com / 587 / tls
   - Mailgun              : smtp.mailgun.org / 587 / tls
   =================================================== */

define('MAIL_FROM',        'influenceematch@gmail.com');
define('MAIL_FROM_NAME',   'Influmatch');

define('MAIL_SMTP_HOST',   'smtp-relay.brevo.com');
define('MAIL_SMTP_PORT',   587);
define('MAIL_SMTP_USER',   '');
define('MAIL_SMTP_PASS',   '');
define('MAIL_SMTP_SECURE', 'tls');              // 'tls' ou 'ssl'

// URL publique du site (pour les liens dans les emails)
define('APP_URL', 'http://localhost/Influmatch');
