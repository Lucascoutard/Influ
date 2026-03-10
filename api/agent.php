<?php
/* ===================================================
   API/AGENT.PHP — Agent marketing IA (Claude)
   Action : chat
   =================================================== */

require_once '../config/agent.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (empty($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Accès réservé aux admins']);
    exit;
}

$action = $_GET['action'] ?? '';
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($action) {
    case 'chat':
        agentChat($body);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action invalide']);
}

// ================================================================

function agentChat(array $body) {
    if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
        http_response_code(503);
        echo json_encode(['error' => 'Clé API non configurée. Renseigne OPENAI_API_KEY dans config/agent.php']);
        return;
    }

    $userMsg = trim($body['message'] ?? '');
    $history = $body['history']  ?? [];  // [{role, content}, ...]

    if ($userMsg === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Message vide']);
        return;
    }

    $system = "Tu es l'agent marketing IA d'Influmatch, une plateforme française de marketing d'influence B2B.\n"
            . "Tu aides les équipes à :\n"
            . "- Générer des prompts visuels pour Midjourney, DALL·E et Stable Diffusion\n"
            . "- Rédiger des briefs créatifs personnalisés par campagne et par influenceur\n"
            . "- Suggérer des légendes, hashtags viraux et calendriers de publication\n"
            . "- Analyser les tendances de niche (Instagram, TikTok, YouTube) et recommander des angles éditoriaux\n"
            . "- Créer des stratégies de campagne d'influence clé en main\n\n"
            . "Réponds toujours en français. Sois concis, créatif et professionnel. "
            . "Utilise du Markdown (titres ##, listes -, **gras**) quand c'est pertinent pour la lisibilité.";

    // OpenAI : le system prompt est le premier message du tableau
    $messages   = [['role' => 'system', 'content' => $system]];
    $messages   = array_merge($messages, array_slice($history, -AGENT_HISTORY_KEEP));
    $messages[] = ['role' => 'user', 'content' => $userMsg];

    $payload = json_encode([
        'model'      => AGENT_MODEL,
        'max_tokens' => AGENT_MAX_TOKENS,
        'messages'   => $messages,
    ]);

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_POST            => true,
        CURLOPT_POSTFIELDS      => $payload,
        CURLOPT_HTTPHEADER      => [
            'Authorization: Bearer ' . OPENAI_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_TIMEOUT         => 30,
        // Fix SSL sur WAMP/XAMPP Windows (certificats non configurés en local)
        CURLOPT_SSL_VERIFYPEER  => false,
        CURLOPT_SSL_VERIFYHOST  => false,
    ]);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    if (!$response) {
        http_response_code(502);
        echo json_encode(['error' => 'Impossible de joindre l\'API OpenAI : ' . $curlError]);
        return;
    }

    $data = json_decode($response, true);

    if ($httpCode !== 200 || empty($data['choices'][0]['message']['content'])) {
        $errMsg = $data['error']['message'] ?? 'Erreur API inconnue';
        http_response_code(502);
        echo json_encode(['error' => $errMsg]);
        return;
    }

    echo json_encode(['reply' => $data['choices'][0]['message']['content']]);
}
