<?php
/* ===================================================
   API/AGENT.PHP - Influmatch AI Agent (OpenAI)
   POST ?action=chat
   =================================================== */

require_once __DIR__ . '/../config/agent.php';
require_once __DIR__ . '/helpers.php';

if (empty($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
    jsonResponse(['error' => 'Admin only.'], 403);
}

$action = $_GET['action'] ?? '';
$body   = getJsonBody();

switch ($action) {
    case 'chat':
        agentChat($body);
        break;
    default:
        jsonResponse(['error' => 'Invalid action.'], 400);
}

function agentChat(array $body): void {
    if (!OPENAI_API_KEY) {
        jsonResponse(['error' => 'API key not configured. Set OPENAI_API_KEY in config/agent.php'], 503);
    }

    $userMsg = trim($body['message'] ?? '');
    $history = array_slice($body['history'] ?? [], -(int)AGENT_HISTORY_KEEP);

    if ($userMsg === '') {
        jsonResponse(['error' => 'Empty message.'], 400);
    }

    $system = <<<PROMPT
You are Influmatch's internal AI assistant for B2B influencer marketing operations.

Core capabilities:
1. Company intelligence and business research.
2. Outbound prospecting email writing.
3. Creative scripts and social media content planning.
4. Daily support for campaign planning and execution.

Rules:
- Reply in English only.
- If the user writes in another language, still answer in English.
- Be direct and actionable.
- Use Markdown for long responses.
- For email requests, always provide Subject + Full Body.
- For video scripts, provide timestamped sections.
- If critical context is missing, ask for it first.
PROMPT;

    $messages = [['role' => 'system', 'content' => $system]];
    foreach ($history as $m) {
        if (isset($m['role'], $m['content']) && in_array($m['role'], ['user', 'assistant'], true)) {
            $messages[] = ['role' => $m['role'], 'content' => (string)$m['content']];
        }
    }
    $messages[] = ['role' => 'user', 'content' => $userMsg];

    $payload = json_encode([
        'model'      => AGENT_MODEL,
        'max_tokens' => (int)AGENT_MAX_TOKENS,
        'messages'   => $messages,
    ]);

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . OPENAI_API_KEY,
            'Content-Type: application/json',
        ],
        CURLOPT_TIMEOUT        => 45,
        CURLOPT_SSL_VERIFYPEER => (APP_ENV !== 'development'),
        CURLOPT_SSL_VERIFYHOST => (APP_ENV !== 'development') ? 2 : 0,
    ]);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    unset($ch);

    if (!$response) {
        jsonResponse(['error' => 'Unable to reach API: ' . $curlError], 502);
    }

    $data = json_decode($response, true);

    if ($httpCode !== 200 || empty($data['choices'][0]['message']['content'])) {
        $errMsg = $data['error']['message'] ?? ('API error (HTTP ' . $httpCode . ')');
        error_log('[Agent] OpenAI error: ' . $errMsg);
        jsonResponse(['error' => $errMsg], 502);
    }

    jsonResponse(['reply' => $data['choices'][0]['message']['content']]);
}
