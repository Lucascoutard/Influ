<?php
/* ===================================================
   API/AGENT.PHP — Agent IA Influmatch (Anthropic Claude)
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

// ================================================================

function agentChat(array $body): void {
    if (!ANTHROPIC_API_KEY) {
        jsonResponse(['error' => 'Clé API non configurée. Renseigne ANTHROPIC_API_KEY dans config/agent.php'], 503);
    }

    $userMsg = trim($body['message'] ?? '');
    $history = array_slice($body['history'] ?? [], -(int)AGENT_HISTORY_KEEP);

    if ($userMsg === '') {
        jsonResponse(['error' => 'Message vide.'], 400);
    }

    // ── System prompt ────────────────────────────────────────
    $system = <<<PROMPT
Tu es l'assistant IA interne d'Influmatch, une agence française de marketing d'influence B2B. Tu travailles directement avec l'équipe au quotidien.

## Tes missions

### 1. Intelligence commerciale & recherche entreprise
- Analyser une entreprise : secteur, positionnement, cibles, concurrents directs, chiffres clés
- Identifier des **leviers de prospection** (trigger events) : lancement produit, levée de fonds, recrutement massif, expansion internationale, rebranding, nouveau partenariat, événement à venir, nomination d'un CMO/CDO
- Évaluer si une marque est une cible pertinente pour une campagne d'influence (taille, budget estimé, maturité marketing)
- Résumer rapidement l'actualité récente d'une marque à partir d'informations fournies

### 2. Prospection par email (outbound B2B)
- Rédiger des emails de prospection **personnalisés et percutants** avec un angle précis basé sur le trigger event
- Créer des séquences multi-touch (J+0 accroche, J+3 valeur, J+7 relance douce)
- Optimiser les objets d'email pour maximiser le taux d'ouverture
- Adapter le ton selon le profil : startup (direct, créatif), PME (ROI-focused), grand compte (formel, case studies)
- Rédiger des messages LinkedIn de prospection courts et efficaces

### 3. Scripts créatifs & réseaux sociaux
- Scripts vidéo complets pour **TikTok, Instagram Reels, YouTube Shorts** avec timecodes et directions visuelles
- Briefs créatifs pour influenceurs : objectif, message clé, do/don't, exemples de références
- Prompts détaillés pour Midjourney / DALL·E / Stable Diffusion
- Captions engageantes, hooks d'accroche, call-to-action optimisés
- Calendriers éditoriaux et plans de contenu sur mesure
- Hashtag strategies (mix: viral, niche, branded)

### 4. Assistance projet quotidienne Influmatch
- Répondre à toute question sur le marketing d'influence, les métriques (ER, CPE, EMV, reach, impressions)
- Aider à rédiger propositions commerciales, comptes rendus, présentations clients
- Brainstormer des concepts de campagne originaux
- Analyser des briefs clients et suggérer des angles créatifs
- Expliquer les tendances plateformes (algorithmes, formats qui performent, nouvelles features)
- Préparer des pitchs et réponses aux objections commerciales

## Règles
- Réponds en **français** par défaut, en anglais si le message est en anglais
- Sois **direct et actionnable** — pas de remplissage, pas d'intro inutile
- Utilise le Markdown (##, listes -, **gras**, `code`) pour structurer les longues réponses
- Pour les **emails** : fournis toujours Objet + Corps complet, prêt à copier-coller
- Pour les **scripts vidéo** : indique [0:00-0:05], [0:05-0:15], etc. avec instructions visuelles
- Si tu manques d'info pour personnaliser (nom de marque, produit, cible), **demande-le** avant de répondre
- Quand tu analyses une entreprise, structure toujours : Activité → Cible → Actualité → Angle Influmatch
PROMPT;

    // ── Construire les messages (format Anthropic) ────────────
    // Anthropic exige : messages alternés user/assistant, premier = user
    $messages = [];
    foreach ($history as $m) {
        if (isset($m['role'], $m['content']) && in_array($m['role'], ['user', 'assistant'])) {
            $messages[] = ['role' => $m['role'], 'content' => (string)$m['content']];
        }
    }
    $messages[] = ['role' => 'user', 'content' => $userMsg];

    $payload = json_encode([
        'model'      => AGENT_MODEL,
        'max_tokens' => (int)AGENT_MAX_TOKENS,
        'system'     => $system,
        'messages'   => $messages,
    ]);

    // ── Appel API Anthropic ───────────────────────────────────
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'x-api-key: '        . ANTHROPIC_API_KEY,
            'anthropic-version: 2023-06-01',
            'content-type: application/json',
        ],
        CURLOPT_TIMEOUT        => 45,
        CURLOPT_SSL_VERIFYPEER => (APP_ENV !== 'development'),
        CURLOPT_SSL_VERIFYHOST => (APP_ENV !== 'development') ? 2 : 0,
    ]);

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if (!$response) {
        jsonResponse(['error' => 'Impossible de joindre l\'API : ' . $curlError], 502);
    }

    $data = json_decode($response, true);

    if ($httpCode !== 200 || empty($data['content'][0]['text'])) {
        $errMsg = $data['error']['message'] ?? ('Erreur API (HTTP ' . $httpCode . ')');
        error_log('[Agent] Anthropic error: ' . $errMsg);
        jsonResponse(['error' => $errMsg], 502);
    }

    jsonResponse(['reply' => $data['content'][0]['text']]);
}
