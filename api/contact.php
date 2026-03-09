<?php
/* ===================================================
   API/CONTACT.PHP — Formulaire de contact
   POST /api/contact.php
   =================================================== */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    jsonResponse(['success' => false, 'message' => 'Méthode non autorisée.'], 405);

$data = getJsonBody();
$error = validateRequired($data, ['name', 'email', 'subject', 'message']);
if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

$name    = trim($data['name']);
$email   = strtolower(trim($data['email']));
$phone   = trim($data['phone'] ?? '');
$subject = trim($data['subject']);
$message = trim($data['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    jsonResponse(['success' => false, 'message' => 'Email invalide.'], 422);

if (strlen($message) < 10)
    jsonResponse(['success' => false, 'message' => 'Le message doit contenir au moins 10 caractères.'], 422);

$db = getDB();
$userId = $_SESSION['user']['id'] ?? null;

$stmt = $db->prepare('INSERT INTO contact_messages (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$userId, $name, $email, $phone, $subject, $message]);

jsonResponse(['success' => true, 'message' => 'Message envoyé ! Nous vous répondrons sous 24h.'], 201);
