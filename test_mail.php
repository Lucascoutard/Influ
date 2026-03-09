<?php
// test_mail.php — FICHIER TEMPORAIRE, supprimer après test
require_once 'config/mail.php';
require_once 'lib/Mailer.php';

// Change cette adresse pour tester la réception
$destinataire = 'influenceematch@gmail.com';

$ok = Mailer::send(
    $destinataire,
    'Client Test',
    'Test Influmatch — Nouveau contrat',
    '<h2>Bonjour !</h2><p>Vous avez reçu un nouveau contrat à signer sur Influmatch.</p>'
);

echo $ok
    ? '✅ Email envoyé à ' . htmlspecialchars($destinataire)
    : '❌ Échec envoi';
