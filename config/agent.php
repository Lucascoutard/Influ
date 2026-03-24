<?php
/* ===================================================
   CONFIG/AGENT.PHP — Agent IA Influmatch (Claude)
   =================================================== */

define('ANTHROPIC_API_KEY', '');            // ← ta clé sur console.anthropic.com
define('AGENT_MODEL',       'claude-haiku-4-5-20251001'); // rapide + économique
define('AGENT_MAX_TOKENS',  2000);
define('AGENT_HISTORY_KEEP', 20);           // nb de messages conservés en contexte
