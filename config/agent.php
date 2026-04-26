<?php
/* ===================================================
   CONFIG/AGENT.PHP — AI Agent Influmatch (OpenAI)
   La clé API est dans config/secrets.php (gitignored)
   =================================================== */

require_once __DIR__ . '/secrets.php';   // defines OPENAI_API_KEY

define('AGENT_MODEL',        'gpt-4o-mini');  // fast + cheap
define('AGENT_MAX_TOKENS',   2000);
define('AGENT_HISTORY_KEEP', 20);
