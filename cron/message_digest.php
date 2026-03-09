<?php
/* ===================================================
   CRON/MESSAGE_DIGEST.PHP — Digest emails messages non lus

   Envoie UN seul email par utilisateur si :
     - Il a des messages non lus de plus de 4h
     - Il n'a pas reçu de digest dans les dernières 24h

   Lancement manuel :
     php cron/message_digest.php

   Windows Task Scheduler (toutes les 30 min) :
     Programme : C:\wamp64\bin\php\phpX.X.X\php.exe
     Arguments : C:\wamp64\www\Influmatch\cron\message_digest.php

   Linux/Mac crontab (toutes les 30 min) :
     */30 * * * * php /var/www/Influmatch/cron/message_digest.php
   =================================================== */

// CLI only — refuser les requêtes HTTP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Accès interdit.');
}

define('CRON_START', microtime(true));

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/Mailer.php';

/* ── Connexion BDD (PDO sans les options HTTP de getDB) ── */
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $db  = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    fwrite(STDERR, '[message_digest] Connexion BDD échouée : ' . $e->getMessage() . PHP_EOL);
    exit(1);
}

/* ── Trouver les utilisateurs avec messages non lus ──────
   Conditions :
   - Messages non lus = messages.id > last_read_msg_id du participant
   - Pas de ses propres messages (sender_id != user_id)
   - Le plus ancien message non lu a plus de 4h (évite d'envoyer pendant une session active)
   - last_email_digest NULL ou > 24h (pas de spam)
   ──────────────────────────────────────────────────────── */
$stmt = $db->query("
    SELECT
        u.id         AS user_id,
        u.email,
        u.firstname,
        u.lastname,
        COUNT(m.id)  AS unread_count,
        GROUP_CONCAT(
            CASE WHEN m.type = 'text' THEN SUBSTRING(m.content, 1, 80)
                 ELSE CONCAT('[', m.type, '] ', COALESCE(m.file_name, ''))
            END
            ORDER BY m.created_at DESC
            SEPARATOR '|||'
        ) AS previews_raw
    FROM users u
    JOIN conversation_participants cp ON cp.user_id = u.id
    JOIN messages m
        ON  m.conversation_id = cp.conversation_id
        AND m.id              > cp.last_read_msg_id
        AND m.sender_id      != u.id
        AND m.created_at     <= NOW() - INTERVAL 4 HOUR
    WHERE u.is_active = 1
      AND u.email IS NOT NULL
      AND u.email != ''
      AND (
          u.last_email_digest IS NULL
          OR u.last_email_digest < NOW() - INTERVAL 24 HOUR
      )
    GROUP BY u.id, u.email, u.firstname, u.lastname
    HAVING unread_count > 0
");

$users  = $stmt->fetchAll();
$sent   = 0;
$errors = 0;

if (empty($users)) {
    log_msg('Aucun utilisateur à notifier.');
    exit(0);
}

log_msg(count($users) . ' utilisateur(s) à notifier.');

/* ── Update timestamp avant envoi (évite doublons si l'envoi prend du temps) ── */
$updateStmt = $db->prepare('UPDATE users SET last_email_digest = NOW() WHERE id = ?');

foreach ($users as $user) {
    $previews = array_filter(
        array_map('trim', explode('|||', $user['previews_raw'] ?? '')),
        fn($p) => $p !== ''
    );
    $previews = array_values(array_slice($previews, 0, 5));

    $name  = trim($user['firstname'] . ' ' . $user['lastname']);
    $count = (int)$user['unread_count'];

    // Marquer comme notifié AVANT l'envoi pour éviter les doublons en cas de retry
    $updateStmt->execute([$user['user_id']]);

    $ok = Mailer::sendMessageDigest($user['email'], $name, $count, $previews);

    if ($ok) {
        $sent++;
        log_msg("✓ Digest envoyé à {$user['email']} ({$count} message(s) non lu(s))");
    } else {
        $errors++;
        log_msg("✗ Échec envoi à {$user['email']}", true);
    }
}

$elapsed = round((microtime(true) - CRON_START) * 1000);
log_msg("Terminé : {$sent} envoyé(s), {$errors} erreur(s) — {$elapsed}ms");
exit($errors > 0 ? 1 : 0);

/* ── Helper log ── */
function log_msg(string $msg, bool $isError = false): void {
    $ts   = date('Y-m-d H:i:s');
    $line = "[{$ts}] {$msg}" . PHP_EOL;
    if ($isError) {
        fwrite(STDERR, $line);
    } else {
        echo $line;
    }
}
