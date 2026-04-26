-- ===================================================
--  INFLUMATCH — DONNÉES DE DÉMO (pour screenshots)
--  À importer APRÈS influmatch_full.sql dans phpMyAdmin
--  Base : influmatch
-- ===================================================

USE `influmatch`;

-- Étend les rôles
ALTER TABLE `users`
  MODIFY COLUMN `role`
    ENUM('admin','client','user','influencer','brand')
    NOT NULL DEFAULT 'user';

-- Table campaign_tasks
CREATE TABLE IF NOT EXISTS `campaign_tasks` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `collab_id`     INT UNSIGNED NOT NULL,
  `title`         VARCHAR(255) NOT NULL,
  `content_type`  VARCHAR(100) DEFAULT NULL,
  `platform`      VARCHAR(50)  DEFAULT NULL,
  `status`        ENUM('todo','in_progress','done','validated') NOT NULL DEFAULT 'todo',
  `due_date`      DATE         DEFAULT NULL,
  `published_url` VARCHAR(500) DEFAULT NULL,
  `notes`         TEXT         DEFAULT NULL,
  `created_by`    INT UNSIGNED NOT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tasks_collab` (`collab_id`),
  CONSTRAINT `fk_tasks_collab`
    FOREIGN KEY (`collab_id`) REFERENCES `collaborations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  UTILISATEURS
--  Mot de passe commun : Admin123!
-- ===================================================
INSERT IGNORE INTO `users`
  (`id`, `firstname`, `lastname`, `email`, `password`, `role`, `company`, `phone`, `is_active`, `last_login`, `created_at`) VALUES

-- Marques
(2, 'Emma',   'Laurent',    'emma@novaskin.us',          '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'brand',     'NovaSkin US',    '+1 212 555 0134', 1, '2026-03-28 08:45:00', '2026-01-15 09:00:00'),
(3, 'Claire', 'Bernard',    'claire@lumierebeauty.com',  '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'brand',     'Lumière Beauty', '+1 310 555 0198', 1, '2026-03-27 14:20:00', '2026-01-22 10:30:00'),

-- Influenceurs
(4, 'Zoe',   'Hoffman',     'zoe@zoehbeauty.com',        '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 917 555 0271', 1, '2026-03-28 09:10:00', '2026-01-18 14:00:00'),
(5, 'Alex',  'Nguyen',      'alex@alexncreates.com',     '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 646 555 0342', 1, '2026-03-26 11:00:00', '2026-01-20 11:00:00'),
(6, 'Sam',   'Fitzgerald',  'sam@samfitzbeauty.com',     '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 424 555 0187', 1, '2026-03-28 10:30:00', '2026-02-01 09:30:00');

-- ===================================================
--  COLLABORATIONS
-- ===================================================
INSERT IGNORE INTO `collaborations`
  (`id`, `title`, `brand_id`, `influencer_id`, `created_by`, `status`, `budget`, `start_date`, `end_date`, `description`, `created_at`) VALUES

(1, 'NovaSkin — Hydration Serum Launch',    2, 4, 1, 'active',    1500.00, '2026-03-01', '2026-03-31',
   '3 Instagram Reels + 2 Story Packs. Highlight the hydration benefits of the new serum. Brand tone: clean, science-backed, glowy. Creator has full creative direction within brand guidelines.',
   '2026-02-20 10:00:00'),

(2, 'Lumière — Holiday Glow Campaign',       3, 5, 1, 'completed', 2200.00, '2025-12-01', '2025-12-31',
   '2 TikTok videos + 1 YouTube dedicated video. Holiday gifting angle. Campaign completed with excellent engagement across all deliverables.',
   '2025-11-15 09:00:00'),

(3, 'NovaSkin — Spring Radiance × Sam',     2, 6, 1, 'active',    1200.00, '2026-03-15', '2026-04-15',
   '2 Instagram Reels + 1 Story Pack. Spring skincare routine featuring the SPF moisturizer. Target audience: women 25–38, skin-conscious.',
   '2026-03-05 14:00:00'),

(4, 'Lumière — Morning Routine × Zoe',      3, 4, 1, 'active',    1800.00, '2026-02-15', '2026-03-30',
   '4 Instagram Posts + 2 Story Packs + 1 Reel. Full morning routine integration. Mid-campaign — performing above benchmark on all published pieces.',
   '2026-02-10 11:00:00'),

(5, 'Petite Glow — Debut Collection',       2, 6, 1, 'pending',    800.00, '2026-04-01', '2026-04-30',
   '1 Instagram Reel + 1 Story Pack. First campaign for this emerging brand. Creator briefing call scheduled April 2nd.',
   '2026-03-20 15:00:00');

-- ===================================================
--  CONTRATS
-- ===================================================
INSERT IGNORE INTO `contracts`
  (`id`, `collab_id`, `client_id`, `created_by`, `title`, `description`, `unsigned_path`, `signed_path`, `status`, `email_sent`, `signed_at`, `created_at`) VALUES

(1, 1, 2, 1,
   'Contract — NovaSkin × Zoe Hoffman',
   'Three-party collaboration agreement for the Hydration Serum Launch. Covers deliverables, usage rights (6 months, digital only), timeline and payment terms.',
   'uploads/contracts/contract_novaskin_zoe_unsigned.pdf',
   'uploads/contracts/contract_novaskin_zoe_signed.pdf',
   'signed', 1, '2026-02-25 14:30:00', '2026-02-22 10:00:00'),

(2, 1, 4, 1,
   'Contract — NovaSkin × Zoe Hoffman',
   'Three-party collaboration agreement for the Hydration Serum Launch. Creator copy.',
   'uploads/contracts/contract_novaskin_zoe_unsigned.pdf',
   'uploads/contracts/contract_novaskin_zoe_signed.pdf',
   'signed', 1, '2026-02-26 09:15:00', '2026-02-22 10:00:00'),

(3, 2, 3, 1,
   'Contract — Lumière × Alex Nguyen',
   'Collaboration agreement for the Holiday Glow Campaign. All deliverables completed and approved. Contract archived.',
   'uploads/contracts/contract_lumiere_alex_unsigned.pdf',
   'uploads/contracts/contract_lumiere_alex_signed.pdf',
   'signed', 1, '2025-11-25 11:00:00', '2025-11-20 09:00:00'),

(4, 3, 2, 1,
   'Contract — NovaSkin × Sam Fitzgerald',
   'Three-party collaboration agreement for the Spring Radiance campaign. Sent to creator for signature.',
   'uploads/contracts/contract_novaskin_sam_unsigned.pdf',
   NULL,
   'pending', 1, NULL, '2026-03-06 09:00:00'),

(5, 4, 3, 1,
   'Contract — Lumière × Zoe Hoffman',
   'Three-party collaboration agreement for the Morning Routine campaign. All parties signed.',
   'uploads/contracts/contract_lumiere_zoe_unsigned.pdf',
   'uploads/contracts/contract_lumiere_zoe_signed.pdf',
   'signed', 1, '2026-02-14 16:45:00', '2026-02-12 10:00:00'),

(6, 5, 2, 1,
   'Contract — Petite Glow × Sam Fitzgerald',
   'Preliminary agreement for the Debut Collection campaign. Awaiting brand final review before sending.',
   'uploads/contracts/contract_petiteglow_sam_unsigned.pdf',
   NULL,
   'pending', 0, NULL, '2026-03-21 10:00:00');

-- ===================================================
--  ÉVÉNEMENTS CALENDRIER
-- ===================================================
INSERT IGNORE INTO `events`
  (`id`, `title`, `description`, `type`, `start_at`, `end_at`, `location`, `client_id`, `created_by`, `created_at`) VALUES

(1,  'Discovery Call — NovaSkin',
     'Initial briefing with Emma. Brand positioning, campaign goals and creator expectations for Q1.',
     'call', '2026-02-18 15:00:00', '2026-02-18 15:45:00', 'Google Meet', 2, 1, '2026-02-17 09:00:00'),

(2,  'Briefing Call — Zoe Hoffman',
     'Onboarding call with Zoe for the NovaSkin campaign. Brief walkthrough, product delivery confirmed.',
     'call', '2026-02-24 14:00:00', '2026-02-24 14:30:00', 'Google Meet', 4, 1, '2026-02-22 10:00:00'),

(3,  'Content Review — NovaSkin × Zoe (Reel #1)',
     'Review of first Reel draft submitted by Zoe. Feedback session with Emma.',
     'meeting', '2026-03-10 14:00:00', '2026-03-10 14:30:00', 'Google Meet', 2, 1, '2026-03-08 10:00:00'),

(4,  'Publishing Deadline — NovaSkin Reel #1',
     'Reel #1 to go live. Zoe confirmed 9am EST.',
     'other', '2026-03-15 09:00:00', NULL, NULL, 4, 1, '2026-03-01 10:00:00'),

(5,  'Campaign Debrief — Lumière Holiday',
     'End-of-campaign debrief with Claire and Alex. Full KPI review, learnings and next steps.',
     'meeting', '2026-01-08 11:00:00', '2026-01-08 12:00:00', 'Zoom', 3, 1, '2026-01-06 09:00:00'),

(6,  'Briefing Call — Sam Fitzgerald',
     'Onboarding for the Spring Radiance campaign. Brief walkthrough and Q&A with Sam.',
     'call', '2026-03-12 16:00:00', '2026-03-12 16:30:00', 'Google Meet', 6, 1, '2026-03-10 10:00:00'),

(7,  'Content Review — Lumière × Zoe (Post #3)',
     'Review of Post #3 draft. Claire to validate before March 10 publish.',
     'meeting', '2026-03-07 10:00:00', '2026-03-07 10:30:00', 'Google Meet', 3, 1, '2026-03-05 09:00:00'),

(8,  'Publishing Deadline — Lumière Story Pack #2',
     'Zoe''s second Story Pack for Lumière goes live.',
     'other', '2026-03-22 09:00:00', NULL, NULL, 4, 1, '2026-03-05 10:00:00'),

(9,  'Contract Follow-up — Sam Fitzgerald',
     'Reminder: follow up with Sam on contract signature for Spring Radiance.',
     'other', '2026-03-20 09:00:00', NULL, NULL, 6, 1, '2026-03-18 09:00:00'),

(10, 'Discovery Call — Petite Glow',
     'Campaign kickoff with Sam and Petite Glow. Final brief validation before content production.',
     'call', '2026-04-02 15:00:00', '2026-04-02 16:00:00', 'Google Meet', 6, 1, '2026-03-25 10:00:00'),

(11, 'Publishing Deadline — NovaSkin Reel #2',
     'Reel #2 live date for Spring Radiance campaign.',
     'other', '2026-03-28 09:00:00', NULL, NULL, 6, 1, '2026-03-10 10:00:00'),

(12, 'Mid-Campaign Review — Lumière × Zoe',
     'Full mid-campaign performance review with Claire. Numbers, feedback, remaining deliverables.',
     'meeting', '2026-03-15 11:00:00', '2026-03-15 12:00:00', 'Zoom', 3, 1, '2026-03-10 09:00:00');

-- ===================================================
--  CAMPAIGN TASKS
-- ===================================================
INSERT IGNORE INTO `campaign_tasks`
  (`id`, `collab_id`, `title`, `content_type`, `platform`, `status`, `due_date`, `published_url`, `notes`, `created_by`, `created_at`) VALUES

-- NovaSkin × Zoe (collab 1)
(1,  1, 'Reel #1 — Morning Hydration Routine',    'reel',  'instagram', 'validated',   '2026-03-15',
     'https://instagram.com/p/demo_reel1',
     '14.2K views, 8.3% engagement rate. Above benchmark. Top comment: "finally a reel that feels real". Brand approved.', 1, '2026-02-25 10:00:00'),

(2,  1, 'Reel #2 — Before & After Serum',         'reel',  'instagram', 'done',        '2026-03-22',
     NULL,
     'Draft submitted March 20. Lifestyle angle — slightly different from brief but strong creative. Awaiting brand validation.', 1, '2026-02-25 10:05:00'),

(3,  1, 'Reel #3 — 7-Day Skin Transformation',    'reel',  'instagram', 'in_progress', '2026-03-29',
     NULL,
     'Creator filming in progress. Draft expected March 26. Product provided for 7-day tracking format.', 1, '2026-02-25 10:10:00'),

(4,  1, 'Story Pack #1 (3 slides)',                'story', 'instagram', 'validated',   '2026-03-08',
     'https://instagram.com/stories/demo_s1',
     '9.1K reach, 6.4% swipe-up rate. Product highlight + link in bio. Strong DM volume post-publish.', 1, '2026-02-25 10:15:00'),

(5,  1, 'Story Pack #2 (2 slides)',                'story', 'instagram', 'todo',        '2026-03-28',
     NULL,
     'End-of-campaign push. Discount code to be included. Code to be provided by NovaSkin by March 24.', 1, '2026-02-25 10:20:00'),

-- Lumière Holiday × Alex (collab 2)
(6,  2, 'TikTok #1 — Holiday Gift Guide',          'video', 'tiktok',   'validated',   '2025-12-05',
     'https://tiktok.com/@alexncreates/demo1',
     '87K views, 12.4% engagement. Exceeded KPI by 3x. Top performing piece of the campaign. Strong comment engagement.', 1, '2025-11-20 10:00:00'),

(7,  2, 'TikTok #2 — Lumière Unboxing',            'video', 'tiktok',   'validated',   '2025-12-15',
     'https://tiktok.com/@alexncreates/demo2',
     '41K views, 9.8% engagement. Strong comments, several purchase intent signals. Brand very satisfied.', 1, '2025-11-20 10:05:00'),

(8,  2, 'YouTube — Full December Skincare Routine','video', 'youtube',  'validated',   '2025-12-20',
     'https://youtube.com/watch?v=demo_lumiere',
     '23K views, 9min 34sec avg watch time. 94% positive sentiment. Drove measurable traffic to brand site.', 1, '2025-11-20 10:10:00'),

-- NovaSkin Spring × Sam (collab 3)
(9,  3, 'Reel #1 — SPF Moisturizer Spring Edit',  'reel',  'instagram', 'in_progress', '2026-03-28',
     NULL,
     'Brief validated by Sam on briefing call. Filming scheduled March 20–22. Draft expected March 25.', 1, '2026-03-06 10:00:00'),

(10, 3, 'Reel #2 — Glow Skin for Spring',          'reel',  'instagram', 'todo',        '2026-04-07',
     NULL,
     'Second deliverable. Brief to be shared once Reel #1 is approved. Same tone, different angle.', 1, '2026-03-06 10:05:00'),

(11, 3, 'Story Pack (3 slides)',                   'story', 'instagram', 'todo',        '2026-04-10',
     NULL,
     'Launch push stories. Swipe-up link to NovaSkin product page. Discount code to be confirmed.', 1, '2026-03-06 10:10:00'),

-- Lumière × Zoe (collab 4)
(12, 4, 'Post #1 — Morning Routine with Lumière',  'photo', 'instagram', 'validated',   '2026-02-20',
     'https://instagram.com/p/demo_lumiere_p1',
     '18.7K likes, 7.2% engagement. On-brand aesthetic, strong product visibility. Claire approved immediately.', 1, '2026-02-12 10:00:00'),

(13, 4, 'Post #2 — Evening Skincare Ritual',       'photo', 'instagram', 'validated',   '2026-02-27',
     'https://instagram.com/p/demo_lumiere_p2',
     '15.2K likes, 6.8% engagement. Softer, evening tone. Good reach extension on the second post.', 1, '2026-02-12 10:05:00'),

(14, 4, 'Post #3 — Hero Product Close-up',         'photo', 'instagram', 'done',        '2026-03-08',
     NULL,
     'Draft submitted March 6. Clean studio-style shot. Pending Claire''s approval — 48h window.', 1, '2026-02-12 10:10:00'),

(15, 4, 'Reel — Full Morning Routine',             'reel',  'instagram', 'in_progress', '2026-03-20',
     NULL,
     'Key campaign deliverable. Creator filming week of March 15. Brand provided additional product for demo.', 1, '2026-02-12 10:15:00'),

(16, 4, 'Story Pack #1 (3 slides)',                'story', 'instagram', 'validated',   '2026-02-22',
     'https://instagram.com/stories/demo_lumiere_s1',
     'Link in bio stories. 11.3K reach. Multiple DMs about product availability.', 1, '2026-02-12 10:20:00'),

(17, 4, 'Story Pack #2 (2 slides)',                'story', 'instagram', 'validated',   '2026-03-03',
     'https://instagram.com/stories/demo_lumiere_s2',
     'Product Q&A stories. 8.9K reach, strong direct message volume. Audience very engaged.', 1, '2026-02-12 10:25:00'),

-- Petite Glow × Sam (collab 5)
(18, 5, 'Reel — Debut Collection Reveal',          'reel',  'instagram', 'todo',        '2026-04-12',
     NULL,
     'Main deliverable. Brief to be validated on April 2nd discovery call. Fresh, editorial tone.', 1, '2026-03-21 10:00:00'),

(19, 5, 'Story Pack (2 slides)',                   'story', 'instagram', 'todo',        '2026-04-14',
     NULL,
     'Launch push stories supporting the Reel. Swipe-up to brand''s debut collection page.', 1, '2026-03-21 10:05:00');

-- ===================================================
--  CONVERSATIONS
-- ===================================================
INSERT IGNORE INTO `conversations` (`id`, `name`, `type`, `created_at`) VALUES
(1, NULL, 'direct', '2026-02-18 16:00:00'),
(2, NULL, 'direct', '2026-02-19 10:00:00'),
(3, NULL, 'direct', '2026-01-23 09:00:00'),
(4, NULL, 'direct', '2026-02-05 11:00:00'),
(5, NULL, 'direct', '2026-03-06 14:00:00'),
(6, 'NovaSkin × Zoe — Hydration Serum', 'group', '2026-02-26 09:00:00');

INSERT IGNORE INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`) VALUES
(1, 1, 6),  (1, 2, 6),
(2, 1, 12), (2, 4, 12),
(3, 1, 17), (3, 3, 17),
(4, 1, 20), (4, 5, 20),
(5, 1, 25), (5, 6, 25),
(6, 1, 30), (6, 2, 30), (6, 4, 30);

-- ===================================================
--  MESSAGES
-- ===================================================
INSERT IGNORE INTO `messages` (`id`, `conversation_id`, `sender_id`, `content`, `type`, `created_at`) VALUES

-- Admin ↔ Emma (NovaSkin)
(1,  1, 1, 'Hi Emma! Welcome to your Influmatch space. The collaboration with Zoe is officially confirmed — contract signed on both sides. We''re all set for March 1st.',                                 'text', '2026-02-26 10:00:00'),
(2,  1, 2, 'Amazing, thank you! Really excited about this one. The brief felt very aligned with what we''ve been looking for. Any next steps on my end?',                                                'text', '2026-02-26 10:15:00'),
(3,  1, 1, 'Nothing from you right now — we''ll send Reel draft #1 for your review around March 12. Use this space for anything in the meantime.',                                                       'text', '2026-02-26 10:18:00'),
(4,  1, 2, 'Quick question — still on track for the March 15 publish date on Reel #1?',                                                                                                                  'text', '2026-03-09 14:30:00'),
(5,  1, 1, 'Yes, confirmed. Zoe submitted her draft this morning — we''re reviewing it now. You''ll receive it for approval by end of day tomorrow.',                                                     'text', '2026-03-09 14:45:00'),
(6,  1, 2, 'Perfect. Really happy with how this campaign is going so far 🙌',                                                                                                                             'text', '2026-03-09 15:00:00'),

-- Admin ↔ Zoe
(7,  2, 1, 'Hey Zoe! Contract fully signed. You''re officially on the NovaSkin campaign. First Reel deadline is March 15 — products should arrive by Feb 28.',                                           'text', '2026-02-26 10:30:00'),
(8,  2, 4, 'Perfect timing! I''ve already been testing the serum for a week — genuinely love the formula. Makes content creation so much easier when you believe in the product.',                        'text', '2026-02-26 11:00:00'),
(9,  2, 1, 'That''s exactly the energy. Let us know if you need any extra product or brand assets — we can get things to you quickly.',                                                                   'text', '2026-02-26 11:10:00'),
(10, 2, 4, 'Just submitted Reel draft #1! I took it in a slightly more lifestyle direction than the brief — curious what you and Emma think.',                                                            'text', '2026-03-09 09:00:00'),
(11, 2, 1, 'Just watched it — the lighting is really good and the lifestyle angle works well. Sharing with Emma now. Expect feedback by March 11.',                                                       'text', '2026-03-09 09:30:00'),
(12, 2, 4, 'Great! Happy to adjust anything if they want tweaks 😊',                                                                                                                                     'text', '2026-03-09 09:35:00'),

-- Admin ↔ Claire (Lumière)
(13, 3, 1, 'Hi Claire! The Lumière × Zoe campaign is live and performing really well. First 2 posts are up — engagement well above our benchmark.',                                                       'text', '2026-02-28 10:00:00'),
(14, 3, 3, 'I saw the posts this morning — the aesthetic is exactly what we wanted. On-brand, elegant, real. What are the numbers looking like?',                                                         'text', '2026-02-28 10:30:00'),
(15, 3, 1, 'Post #1: 18.7K likes, 7.2% engagement. Post #2: 15.2K likes, 6.8% engagement. Both above the 5% benchmark. Very strong start.',                                                             'text', '2026-02-28 10:40:00'),
(16, 3, 3, 'Those are great numbers. Honestly really happy we went with Influmatch for this. What''s coming next?',                                                                                       'text', '2026-02-28 11:00:00'),
(17, 3, 1, 'Post #3 draft is in review — you''ll receive it this week. The Reel (main deliverable) is being filmed now. Ready for your approval around March 18.',                                       'text', '2026-02-28 11:10:00'),

-- Admin ↔ Alex
(18, 4, 1, 'Hey Alex! The Lumière Holiday campaign wrapped up beautifully. Your TikTok #1 hit 87K views — way above target. Full debrief Jan 8.',                                                        'text', '2026-01-05 10:00:00'),
(19, 4, 5, 'That campaign was genuinely fun to work on. Lumière gave me creative freedom while being really clear on the brief — that combination is rare.',                                              'text', '2026-01-05 10:30:00'),
(20, 4, 1, 'Exactly what we aim for. Full performance report coming before the debrief. Looking forward to talking next steps.',                                                                          'text', '2026-01-05 10:45:00'),

-- Admin ↔ Sam
(21, 5, 1, 'Hi Sam! Welcome to Influmatch. Your contract for the Spring Radiance campaign with NovaSkin has been sent — please sign when you get a chance.',                                              'text', '2026-03-06 14:00:00'),
(22, 5, 6, 'Hey! Got it — reviewing now. The brief looks solid. SPF content is very timely for my audience heading into spring.',                                                                         'text', '2026-03-06 15:00:00'),
(23, 5, 1, 'Perfect timing! We''re targeting March 28 for Reel #1. That gives you ~3 weeks. Does that timeline work?',                                                                                   'text', '2026-03-06 15:10:00'),
(24, 5, 6, 'Absolutely. Planning a filming day next week. Quick question — how much creative latitude do I have vs. brand guidelines?',                                                                   'text', '2026-03-06 15:20:00'),
(25, 5, 1, 'NovaSkin is very open to your creative direction — that''s part of why we matched you with them. Guidelines are in the brief but treat them as a starting point, not a script.',             'text', '2026-03-06 15:30:00'),

-- Groupe: NovaSkin × Zoe
(26, 6, 1, 'Welcome to the campaign channel! This is the shared space for NovaSkin, Zoe, and Influmatch throughout the collaboration. All key updates will come through here.',                          'text', '2026-02-26 09:15:00'),
(27, 6, 2, 'Hi Zoe! Really looking forward to this. Love your work — you were at the top of our shortlist.',                                                                                             'text', '2026-02-26 09:30:00'),
(28, 6, 4, 'Hi Emma! Thank you 🙏 I''ve been testing the serum already — week in, skin is noticeably more hydrated. Excited to share it authentically.',                                                 'text', '2026-02-26 09:45:00'),
(29, 6, 2, 'That''s exactly what we hoped to hear. Feel free to ask anything here — we''re very hands-on.',                                                                                              'text', '2026-02-26 10:00:00'),
(30, 6, 1, 'Reel draft #1 submitted ✓ Emma, you''ll receive it for review by tomorrow EOD. Feedback window: 48h. Zoe, great work on the first piece.',                                                  'text', '2026-03-09 09:35:00');

-- ===================================================
--  MESSAGES DE CONTACT (formulaire public)
-- ===================================================
INSERT IGNORE INTO `contact_messages`
  (`id`, `user_id`, `name`, `email`, `phone`, `subject`, `message`, `is_read`, `created_at`) VALUES

(1, NULL, 'Rachel Martin',   'rachel@petiteglow.com',       '+1 415 555 0192', 'Brand inquiry',
   'Hi, I run Petite Glow, an emerging clean beauty brand based in San Francisco. We''re looking to launch our debut collection with a structured influencer campaign. How does Influmatch work?',
   1, '2026-03-18 09:30:00'),

(2, NULL, 'Nina Torres',     'nina@vivid-skin.com',         '+1 646 555 0217', 'Partnership inquiry',
   'We''re Vivid Skin, a NYC-based skincare startup. We''ve been following Influmatch and love the concept of the three-party contract. Can we schedule a call?',
   1, '2026-03-20 14:15:00'),

(3, NULL, 'Léa Fontaine',    'lea.fontaine@gmail.com',      '+1 929 555 0341', 'Creator application',
   'Hi! I''m a beauty creator on Instagram with 22K followers (avg 8.1% engagement). I specialize in skincare and clean beauty. Very interested in joining the Influmatch creator network.',
   0, '2026-03-24 11:00:00'),

(4, NULL, 'Marcus Webb',     'marcus@bloomlabs.co',         '+1 312 555 0088', 'Brand inquiry',
   'Bloom Labs here — we make science-backed haircare products. Interested in finding creators who can speak to the formulation angle authentically. Is that something Influmatch can handle?',
   0, '2026-03-26 16:45:00'),

(5, NULL, 'Priya Sharma',    'priya.creates@gmail.com',     '+1 718 555 0463', 'Creator application',
   'I''m a lifestyle and wellness creator on Instagram and TikTok (34K + 18K). I''ve had bad experiences with unstructured brand deals in the past. The Influmatch contract model sounds exactly like what I''ve been looking for.',
   0, '2026-03-27 10:20:00');
