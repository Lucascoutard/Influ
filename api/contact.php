<?php
/* ===================================================
   API/CONTACT.PHP - Contact form endpoint
   POST /api/contact.php
   =================================================== */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);

$data = getJsonBody();
$error = validateRequired($data, ['name', 'email', 'subject', 'message']);
if ($error) jsonResponse(['success' => false, 'message' => $error], 422);

$name    = trim($data['name']);
$email   = strtolower(trim($data['email']));
$phone   = trim($data['phone'] ?? '');
$subject = trim($data['subject']);
$message = trim($data['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    jsonResponse(['success' => false, 'message' => 'Invalid email.'], 422);

if (strlen($message) < 10)
    jsonResponse(['success' => false, 'message' => 'Message must contain at least 10 characters.'], 422);

$db = getDB();
$userId = $_SESSION['user']['id'] ?? null;

$stmt = $db->prepare('INSERT INTO contact_messages (user_id, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$userId, $name, $email, $phone, $subject, $message]);

jsonResponse(['success' => true, 'message' => 'Message sent! We will reply within 24h.'], 201);

