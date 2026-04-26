<?php
/* ===================================================
   API/HELPBOT.PHP — Influmatch Public AI Assistant (OpenAI)
   POST ?action=chat  (no authentication required)
   =================================================== */

require_once __DIR__ . '/../config/agent.php';
require_once __DIR__ . '/helpers.php';

if (session_status() === PHP_SESSION_NONE) session_start();

const HELPBOT_MAX_PER_SESSION = 30;  // per browser session
const HELPBOT_MAX_PER_IP_HOUR = 60;  // per IP per hour

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$action = $_GET['action'] ?? '';
$body   = getJsonBody();

switch ($action) {
    case 'chat':
        helpbotChat($body);
        break;
    default:
        jsonResponse(['error' => 'Invalid action.'], 400);
}

function helpbotIpRateLimit(): void {
    // Resolve client IP (handle reverse proxy safely)
    $raw = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    $ip  = trim(explode(',', $raw)[0]);
    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = 'unknown';
    }
    $key    = 'hb_ip_' . md5($ip);
    $window = 3600; // 1 hour in seconds

    if (function_exists('apcu_fetch')) {
        // APCu path (preferred — zero I/O)
        $count = apcu_fetch($key);
        if ($count === false) {
            apcu_store($key, 1, $window);
        } elseif ($count >= HELPBOT_MAX_PER_IP_HOUR) {
            jsonResponse(['error' => 'Too many requests. Please try again later.'], 429);
        } else {
            apcu_inc($key);
        }
    } else {
        // File-based fallback
        $tmpFile = sys_get_temp_dir() . '/hb_' . md5($ip) . '.json';
        $now  = time();
        $hits = [];
        if (file_exists($tmpFile)) {
            $hits = json_decode(file_get_contents($tmpFile), true) ?? [];
        }
        // Keep only timestamps within the window
        $hits = array_values(array_filter($hits, fn($t) => ($now - $t) < $window));
        if (count($hits) >= HELPBOT_MAX_PER_IP_HOUR) {
            jsonResponse(['error' => 'Too many requests. Please try again later.'], 429);
        }
        $hits[] = $now;
        file_put_contents($tmpFile, json_encode($hits), LOCK_EX);
    }
}

function helpbotChat(array $body): void {
    if (!OPENAI_API_KEY) {
        jsonResponse(['error' => 'AI assistant temporarily unavailable.'], 503);
    }

    // Rate limiting: IP-based (hourly) + session-based
    helpbotIpRateLimit();
    $_SESSION['hb_count'] = ($_SESSION['hb_count'] ?? 0) + 1;
    if ($_SESSION['hb_count'] > HELPBOT_MAX_PER_SESSION) {
        jsonResponse(['error' => 'You have reached the message limit for this session. Please contact us at contact@influmatchagency.com.'], 429);
    }

    $userMsg = trim($body['message'] ?? '');
    $history = array_slice($body['history'] ?? [], -12);

    if ($userMsg === '') {
        jsonResponse(['error' => 'Empty message.'], 400);
    }

    $system = <<<PROMPT
You are the official Influmatch assistant. Influmatch is a premium agency specializing in collaborations between beauty brands and content creators.

YOUR ROLE
- Answer brands and creators professionally, clearly, and in a business-oriented tone.
- Explain simply, reassure, highlight expertise, and guide toward action.

POSITIONING
Influmatch is not a standard agency. It is a premium intermediary that:
- Selects the right creator profiles
- Secures collaborations end-to-end
- Structures every step of the process

Influmatch does NOT work on volume. Influmatch optimizes the fit between brand and creator.

FULL PROCESS
Influmatch manages the entire workflow:
1. Creator sourcing
2. Audience verification
3. Profile selection
4. Introduction
5. Brief and scoping
6. Tripartite contract (brand + creator + Influmatch)
7. Production follow-up
8. Validation
9. Publication
10. Secured payment (Stripe / PayPal)

GUARANTEES
Influmatch guarantees: a clear framework, structured collaboration, relevant selection, contractual security, traceable payment.
Influmatch does NOT guarantee: specific results, sales, or precise ROI.

BUSINESS MODEL
Fixed commission: 30% — covers sourcing, selection, introduction, contract, coordination, and full follow-up. No hidden fees.

TARGET CLIENTS
Brands: beauty sector, US market priority, growing brands open to influencer marketing.
Creators: beauty niche, 20k–300k followers, quality content, credible audience, professional email required.

SERVICE LOGIC
Influmatch proposes 1 main creator, up to 2–3 maximum when necessary.
Goal: avoid decision overload, maximize relevance, accelerate decisions.

TONE & STYLE RULES
- Always address the user formally and professionally.
- Be direct and clear. Avoid unnecessary jargon and long sentences.
- Do NOT make exaggerated promises or give vague answers.
- NEVER invent figures, emails, or guarantee specific results.
- Do NOT say "it depends" without explaining what it depends on.

RESPONSE STRUCTURE
Each response must: answer clearly, briefly explain, add value, and optionally guide toward an action.
Keep responses concise. Use bullet points for lists. Avoid walls of text.

LANGUAGE
Reply in the same language as the user's message. If the user writes in French, reply in French. If in English, reply in English.
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
        'max_tokens' => 600,
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
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => (APP_ENV !== 'development'),
        CURLOPT_SSL_VERIFYHOST => (APP_ENV !== 'development') ? 2 : 0,
    ]);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    unset($ch);

    if (!$response) {
        jsonResponse(['error' => 'Unable to reach AI service: ' . $curlError], 502);
    }

    $data = json_decode($response, true);

    if ($httpCode !== 200 || empty($data['choices'][0]['message']['content'])) {
        $errMsg = $data['error']['message'] ?? ('API error (HTTP ' . $httpCode . ')');
        error_log('[HelpBot] OpenAI error: ' . $errMsg);
        $displayErr = (APP_ENV === 'development') ? $errMsg : 'The assistant is temporarily unavailable. Please try again.';
        jsonResponse(['error' => $displayErr], 502);
    }

    jsonResponse(['reply' => $data['choices'][0]['message']['content']]);
}
