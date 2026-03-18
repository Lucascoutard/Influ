<?php
/* ===================================================
   API/STATS.PHP — Métriques admin (admin only)
   GET ?action=overview
   =================================================== */

require_once __DIR__ . '/helpers.php';

requireRole('admin');

$db = getDB();

// ── Utilisateurs ────────────────────────────────────
$usersTotal   = (int)$db->query('SELECT COUNT(*) FROM users')->fetchColumn();
$usersActive  = (int)$db->query("SELECT COUNT(*) FROM users WHERE is_active = 1")->fetchColumn();
$clients      = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'client' AND is_active = 1")->fetchColumn();
$admins       = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
$newThisWeek  = (int)$db->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn();

// ── Messages non lus (pour les admins) ──────────────
$unread = 0;
try {
    $unread = (int)$db->query("
        SELECT COUNT(DISTINCT m.id)
        FROM messages m
        JOIN conversation_participants cp
          ON cp.conversation_id = m.conversation_id
        JOIN users u
          ON u.id = cp.user_id AND u.role = 'admin'
        WHERE m.sender_id != u.id
          AND m.id > cp.last_read_msg_id
    ")->fetchColumn();
} catch (Exception $e) {}

// ── Collaborations ───────────────────────────────────
$collabsTotal  = 0;
$collabsActive = 0;
$recentCollabs = [];
try {
    $collabsTotal     = (int)$db->query('SELECT COUNT(*) FROM collaborations')->fetchColumn();
    $collabsActive    = (int)$db->query("SELECT COUNT(*) FROM collaborations WHERE status = 'active'")->fetchColumn();
    $collabsPending   = (int)$db->query("SELECT COUNT(*) FROM collaborations WHERE status = 'pending'")->fetchColumn();
    $collabsCompleted = (int)$db->query("SELECT COUNT(*) FROM collaborations WHERE status = 'completed'")->fetchColumn();
    $collabsCancelled = (int)$db->query("SELECT COUNT(*) FROM collaborations WHERE status = 'cancelled'")->fetchColumn();
    $recentCollabs = $db->query("
        SELECT c.id, c.title, c.status, c.budget, c.created_at,
               b.firstname AS brand_firstname, b.lastname AS brand_lastname, b.company AS brand_company,
               i.firstname AS inf_firstname, i.lastname AS inf_lastname
        FROM collaborations c
        JOIN users b ON b.id = c.brand_id
        JOIN users i ON i.id = c.influencer_id
        ORDER BY c.created_at DESC
        LIMIT 10
    ")->fetchAll();
} catch (Exception $e) {}

// ── 5 derniers inscrits ──────────────────────────────
$recentUsers = $db->query(
    "SELECT id, firstname, lastname, email, role, is_active, created_at
     FROM users ORDER BY created_at DESC LIMIT 5"
)->fetchAll();

jsonResponse([
    'success' => true,
    'stats' => [
        'users_total'    => $usersTotal,
        'users_active'   => $usersActive,
        'clients'        => $clients,
        'admins'         => $admins,
        'new_this_week'  => $newThisWeek,
        'messages_unread'=> $unread,
        'collabs_total'     => $collabsTotal,
        'collabs_active'    => $collabsActive,
        'collabs_pending'   => $collabsPending,
        'collabs_completed' => $collabsCompleted,
        'collabs_cancelled' => $collabsCancelled,
    ],
    'recent_users'  => $recentUsers,
    'recent_collabs'=> $recentCollabs,
]);
