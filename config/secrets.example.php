<?php
/* ===================================================
   CONFIG/SECRETS.EXAMPLE.PHP — Template à copier

   1. Copier ce fichier : cp secrets.example.php secrets.php
   2. Remplir les valeurs ci-dessous
   3. Ne JAMAIS committer secrets.php
   =================================================== */

define('APP_ENV', 'production');       // 'development' | 'production'
define('APP_URL', 'https://votre-domaine.fr');

define('DB_HOST',    'localhost');
define('DB_NAME',    'nom_de_la_base');
define('DB_USER',    'utilisateur_db');
define('DB_PASS',    'mot_de_passe_db');
define('DB_CHARSET', 'utf8mb4');

define('OPENAI_API_KEY', 'sk-proj-...');  // https://platform.openai.com/api-keys

define('MAIL_FROM',        'contact@votre-domaine.fr');
define('MAIL_FROM_NAME',   'Influmatch');
define('MAIL_SMTP_HOST',   'smtp-relay.brevo.com');
define('MAIL_SMTP_PORT',   587);
define('MAIL_SMTP_USER',   'votre-user@smtp-brevo.com');
define('MAIL_SMTP_PASS',   'votre-mot-de-passe-smtp');
define('MAIL_SMTP_SECURE', 'tls');
