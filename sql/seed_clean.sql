-- ===================================================
--  INFLUMATCH — CLEAN SEED
--  Compatible phpMyAdmin (zéro variables de session)
--  Admin conservé : lucas.coutardbtr@gmail.com
-- ===================================================

USE `influmatch`;

-- ── 1. Purge dans l'ordre FK (enfants avant parents) ──
DELETE FROM `campaign_tasks`;
DELETE FROM `messages`;
DELETE FROM `conversation_participants`;
DELETE FROM `conversations`;
DELETE FROM `call_signals`;
DELETE FROM `contracts`;
DELETE FROM `events`;
DELETE FROM `collaborations`;
DELETE FROM `contact_messages`;
DELETE FROM `users` WHERE email != 'lucas.coutardbtr@gmail.com';

-- ── 2. Enum roles ──────────────────────────────────────
ALTER TABLE `users`
  MODIFY COLUMN `role`
    ENUM('admin','client','user','influencer','brand')
    NOT NULL DEFAULT 'user';

-- ── 3. Table campaign_tasks ───────────────────────────
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

-- ── 4. Utilisateurs demo ──────────────────────────────
INSERT INTO `users`
  (`firstname`, `lastname`, `email`, `password`, `role`, `company`, `phone`, `is_active`, `last_login`, `created_at`) VALUES
('Emma',   'Laurent',    'emma@novaskin.us',         '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'brand',     'NovaSkin US',    '+1 212 555 0134', 1, '2026-03-28 08:45:00', '2026-01-15 09:00:00'),
('Claire', 'Bernard',    'claire@lumierebeauty.com', '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'brand',     'Lumiere Beauty', '+1 310 555 0198', 1, '2026-03-27 14:20:00', '2026-01-22 10:30:00'),
('Zoe',    'Hoffman',    'zoe@zoehbeauty.com',       '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 917 555 0271', 1, '2026-03-28 09:10:00', '2026-01-18 14:00:00'),
('Alex',   'Nguyen',     'alex@alexncreates.com',    '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 646 555 0342', 1, '2026-03-26 11:00:00', '2026-01-20 11:00:00'),
('Sam',    'Fitzgerald', 'sam@samfitzbeauty.com',    '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe', 'influencer', NULL,             '+1 424 555 0187', 1, '2026-03-28 10:30:00', '2026-02-01 09:30:00');

-- ── 5. Collaborations ─────────────────────────────────
INSERT INTO `collaborations`
  (`title`, `brand_id`, `influencer_id`, `created_by`, `status`, `budget`, `start_date`, `end_date`, `description`, `created_at`) VALUES

('NovaSkin - Hydration Serum Launch',
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'active', 1500.00, '2026-03-01', '2026-03-31',
  '3 Instagram Reels + 2 Story Packs. Highlight the hydration benefits of the new serum. Brand tone: clean, science-backed, glowy.',
  '2026-02-20 10:00:00'),

('Lumiere - Holiday Glow Campaign',
  (SELECT id FROM users WHERE email='claire@lumierebeauty.com'),
  (SELECT id FROM users WHERE email='alex@alexncreates.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'completed', 2200.00, '2025-12-01', '2025-12-31',
  '2 TikTok videos + 1 YouTube video. Holiday gifting angle. Campaign completed with excellent engagement.',
  '2025-11-15 09:00:00'),

('NovaSkin - Spring Radiance x Sam',
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'active', 1200.00, '2026-03-15', '2026-04-15',
  '2 Instagram Reels + 1 Story Pack. Spring skincare routine featuring the SPF moisturizer.',
  '2026-03-05 14:00:00'),

('Lumiere - Morning Routine x Zoe',
  (SELECT id FROM users WHERE email='claire@lumierebeauty.com'),
  (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'active', 1800.00, '2026-02-15', '2026-03-30',
  '4 Instagram Posts + 2 Story Packs + 1 Reel. Full morning routine integration. Performing above benchmark.',
  '2026-02-10 11:00:00'),

('Petite Glow - Debut Collection',
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'pending', 800.00, '2026-04-01', '2026-04-30',
  '1 Instagram Reel + 1 Story Pack. First campaign for this emerging brand.',
  '2026-03-20 15:00:00');

-- ── 6. Contrats ───────────────────────────────────────
INSERT INTO `contracts`
  (`collab_id`, `client_id`, `created_by`, `title`, `description`, `unsigned_path`, `signed_path`, `status`, `email_sent`, `signed_at`, `created_at`) VALUES

((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - NovaSkin x Zoe Hoffman',
  'Three-party agreement for the Hydration Serum Launch. Deliverables, usage rights (6 months digital), payment terms.',
  'uploads/contracts/novaskin_zoe_unsigned.pdf', 'uploads/contracts/novaskin_zoe_signed.pdf',
  'signed', 1, '2026-02-25 14:30:00', '2026-02-22 10:00:00'),

((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),
  (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - NovaSkin x Zoe Hoffman',
  'Three-party agreement for the Hydration Serum Launch. Creator copy.',
  'uploads/contracts/novaskin_zoe_unsigned.pdf', 'uploads/contracts/novaskin_zoe_signed.pdf',
  'signed', 1, '2026-02-26 09:15:00', '2026-02-22 10:00:00'),

((SELECT id FROM collaborations WHERE title='Lumiere - Holiday Glow Campaign'),
  (SELECT id FROM users WHERE email='claire@lumierebeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - Lumiere x Alex Nguyen',
  'Agreement for the Holiday Glow Campaign. All deliverables completed and approved.',
  'uploads/contracts/lumiere_alex_unsigned.pdf', 'uploads/contracts/lumiere_alex_signed.pdf',
  'signed', 1, '2025-11-25 11:00:00', '2025-11-20 09:00:00'),

((SELECT id FROM collaborations WHERE title='NovaSkin - Spring Radiance x Sam'),
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - NovaSkin x Sam Fitzgerald',
  'Three-party agreement for the Spring Radiance campaign. Sent to creator for signature.',
  'uploads/contracts/novaskin_sam_unsigned.pdf', NULL,
  'pending', 1, NULL, '2026-03-06 09:00:00'),

((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),
  (SELECT id FROM users WHERE email='claire@lumierebeauty.com'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - Lumiere x Zoe Hoffman',
  'Three-party agreement for the Morning Routine campaign. All parties signed.',
  'uploads/contracts/lumiere_zoe_unsigned.pdf', 'uploads/contracts/lumiere_zoe_signed.pdf',
  'signed', 1, '2026-02-14 16:45:00', '2026-02-12 10:00:00'),

((SELECT id FROM collaborations WHERE title='Petite Glow - Debut Collection'),
  (SELECT id FROM users WHERE email='emma@novaskin.us'),
  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'),
  'Contract - Petite Glow x Sam Fitzgerald',
  'Preliminary agreement for the Debut Collection. Awaiting brand final review.',
  'uploads/contracts/petiteglow_sam_unsigned.pdf', NULL,
  'pending', 0, NULL, '2026-03-21 10:00:00');

-- ── 7. Événements ────────────────────────────────────
INSERT INTO `events`
  (`title`, `description`, `type`, `start_at`, `end_at`, `location`, `client_id`, `created_by`, `created_at`) VALUES
('Discovery Call - NovaSkin',              'Initial briefing with Emma. Brand positioning and campaign goals.',      'call',    '2026-02-18 15:00:00', '2026-02-18 15:45:00', 'Google Meet', (SELECT id FROM users WHERE email='emma@novaskin.us'),        (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-02-17 09:00:00'),
('Briefing Call - Zoe Hoffman',            'Onboarding for the NovaSkin campaign. Brief walkthrough.',               'call',    '2026-02-24 14:00:00', '2026-02-24 14:30:00', 'Google Meet', (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),       (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-02-22 10:00:00'),
('Content Review - NovaSkin x Zoe Reel 1','Review of first Reel draft. Feedback session with Emma.',                'meeting', '2026-03-10 14:00:00', '2026-03-10 14:30:00', 'Google Meet', (SELECT id FROM users WHERE email='emma@novaskin.us'),        (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-08 10:00:00'),
('Publishing Deadline - NovaSkin Reel 1',  'Reel 1 to go live. Zoe confirmed 9am EST.',                             'other',   '2026-03-15 09:00:00', NULL,                  NULL,          (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),       (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-01 10:00:00'),
('Campaign Debrief - Lumiere Holiday',     'End-of-campaign debrief with Claire and Alex. Full KPI review.',        'meeting', '2026-01-08 11:00:00', '2026-01-08 12:00:00', 'Zoom',        (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-01-06 09:00:00'),
('Briefing Call - Sam Fitzgerald',         'Onboarding for the Spring Radiance campaign.',                           'call',    '2026-03-12 16:00:00', '2026-03-12 16:30:00', 'Google Meet', (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-10 10:00:00'),
('Content Review - Lumiere x Zoe Post 3',  'Review of Post 3 draft. Claire to validate.',                           'meeting', '2026-03-07 10:00:00', '2026-03-07 10:30:00', 'Google Meet', (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-05 09:00:00'),
('Publishing Deadline - Lumiere Story 2',  'Zoe second Story Pack for Lumiere goes live.',                          'other',   '2026-03-22 09:00:00', NULL,                  NULL,          (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'),       (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-05 10:00:00'),
('Contract Follow-up - Sam',               'Follow up with Sam on contract signature for Spring Radiance.',          'other',   '2026-03-20 09:00:00', NULL,                  NULL,          (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-18 09:00:00'),
('Discovery Call - Petite Glow',           'Campaign kickoff with Sam and Petite Glow. Brief validation.',           'call',    '2026-04-02 15:00:00', '2026-04-02 16:00:00', 'Google Meet', (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-25 10:00:00'),
('Publishing Deadline - NovaSkin Reel 2',  'Reel 2 live date for Spring Radiance campaign.',                        'other',   '2026-03-28 09:00:00', NULL,                  NULL,          (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'),    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-10 10:00:00'),
('Mid-Campaign Review - Lumiere x Zoe',    'Full mid-campaign performance review with Claire.',                     'meeting', '2026-03-15 11:00:00', '2026-03-15 12:00:00', 'Zoom',        (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), '2026-03-10 09:00:00');

-- ── 8. Campaign tasks ────────────────────────────────
INSERT INTO `campaign_tasks`
  (`collab_id`, `title`, `content_type`, `platform`, `status`, `due_date`, `published_url`, `notes`, `created_by`) VALUES

((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),    'Reel 1 - Morning Hydration Routine',       'reel',  'instagram', 'validated',   '2026-03-15', 'https://instagram.com/p/demo_reel1',              '14.2K views, 8.3% engagement. Above benchmark. Brand approved.',              (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),    'Reel 2 - Before After Serum',              'reel',  'instagram', 'done',        '2026-03-22', NULL,                                              'Draft submitted March 20. Lifestyle angle. Awaiting brand validation.',        (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),    'Reel 3 - 7-Day Skin Transformation',       'reel',  'instagram', 'in_progress', '2026-03-29', NULL,                                              'Creator filming in progress. Draft expected March 26.',                        (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),    'Story Pack 1 (3 slides)',                  'story', 'instagram', 'validated',   '2026-03-08', 'https://instagram.com/stories/demo_s1',           '9.1K reach, 6.4% swipe-up rate. Strong DM volume.',                           (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Hydration Serum Launch'),    'Story Pack 2 (2 slides)',                  'story', 'instagram', 'todo',        '2026-03-28', NULL,                                              'End-of-campaign push. Discount code to be provided by NovaSkin.',             (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),

((SELECT id FROM collaborations WHERE title='Lumiere - Holiday Glow Campaign'),      'TikTok 1 - Holiday Gift Guide',            'video', 'tiktok',    'validated',   '2025-12-05', 'https://tiktok.com/@alexncreates/demo1',          '87K views, 12.4% engagement. Exceeded KPI by 3x.',                            (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Holiday Glow Campaign'),      'TikTok 2 - Lumiere Unboxing',              'video', 'tiktok',    'validated',   '2025-12-15', 'https://tiktok.com/@alexncreates/demo2',          '41K views, 9.8% engagement. Brand very satisfied.',                           (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Holiday Glow Campaign'),      'YouTube - Full December Skincare Routine', 'video', 'youtube',   'validated',   '2025-12-20', 'https://youtube.com/watch?v=demo_lumiere',        '23K views, 9min avg watch time. 94% positive sentiment.',                     (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),

((SELECT id FROM collaborations WHERE title='NovaSkin - Spring Radiance x Sam'),     'Reel 1 - SPF Moisturizer Spring Edit',     'reel',  'instagram', 'in_progress', '2026-03-28', NULL,                                              'Filming scheduled March 20-22. Draft expected March 25.',                     (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Spring Radiance x Sam'),     'Reel 2 - Glow Skin for Spring',            'reel',  'instagram', 'todo',        '2026-04-07', NULL,                                              'Brief to be shared once Reel 1 is approved.',                                 (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='NovaSkin - Spring Radiance x Sam'),     'Story Pack (3 slides)',                    'story', 'instagram', 'todo',        '2026-04-10', NULL,                                              'Launch push stories. Swipe-up to NovaSkin product page.',                     (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),

((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Post 1 - Morning Routine with Lumiere',    'photo', 'instagram', 'validated',   '2026-02-20', 'https://instagram.com/p/demo_lumiere_p1',         '18.7K likes, 7.2% engagement. Claire approved immediately.',                  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Post 2 - Evening Skincare Ritual',         'photo', 'instagram', 'validated',   '2026-02-27', 'https://instagram.com/p/demo_lumiere_p2',         '15.2K likes, 6.8% engagement.',                                               (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Post 3 - Hero Product Close-up',           'photo', 'instagram', 'done',        '2026-03-08', NULL,                                              'Draft submitted March 6. Pending Claire approval.',                           (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Reel - Full Morning Routine',              'reel',  'instagram', 'in_progress', '2026-03-20', NULL,                                              'Key deliverable. Creator filming week of March 15.',                           (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Story Pack 1 (3 slides)',                  'story', 'instagram', 'validated',   '2026-02-22', 'https://instagram.com/stories/demo_lumiere_s1',   '11.3K reach. Multiple DMs about product.',                                    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Lumiere - Morning Routine x Zoe'),      'Story Pack 2 (2 slides)',                  'story', 'instagram', 'validated',   '2026-03-03', 'https://instagram.com/stories/demo_lumiere_s2',   '8.9K reach, strong DM volume.',                                               (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),

((SELECT id FROM collaborations WHERE title='Petite Glow - Debut Collection'),       'Reel - Debut Collection Reveal',           'reel',  'instagram', 'todo',        '2026-04-12', NULL,                                              'Main deliverable. Brief to be validated on April 2nd call.',                  (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com')),
((SELECT id FROM collaborations WHERE title='Petite Glow - Debut Collection'),       'Story Pack (2 slides)',                    'story', 'instagram', 'todo',        '2026-04-14', NULL,                                              'Launch push stories supporting the Reel.',                                    (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'));

-- ── 9. Conversations ─────────────────────────────────
INSERT INTO `conversations` (`name`, `type`, `created_at`) VALUES
(NULL, 'direct', '2026-02-18 16:00:00'),
(NULL, 'direct', '2026-02-19 10:00:00'),
(NULL, 'direct', '2026-01-23 09:00:00'),
(NULL, 'direct', '2026-02-05 11:00:00'),
(NULL, 'direct', '2026-03-06 14:00:00'),
('NovaSkin x Zoe - Hydration Serum', 'group', '2026-02-26 09:00:00');

-- ── 10. Participants ─────────────────────────────────
-- admin <-> emma
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';

-- admin <-> zoe
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';

-- admin <-> claire
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';

-- admin <-> alex
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-05 11:00:00';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='alex@alexncreates.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-05 11:00:00';

-- admin <-> sam
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'), 0 FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';

-- group: admin + emma + zoe
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 0 FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 0 FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `conversation_participants` (`conversation_id`, `user_id`, `last_read_msg_id`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 0 FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';

-- ── 11. Messages ─────────────────────────────────────
-- conv emma
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Hi Emma! Welcome to your Influmatch space. The collaboration with Zoe is confirmed — contract signed on both sides. All set for March 1st.', 'text', '2026-02-26 10:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 'Amazing, thank you! Really excited. Any next steps on my end?', 'text', '2026-02-26 10:15:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Nothing for now — we will send Reel draft 1 for your review around March 12.', 'text', '2026-02-26 10:18:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 'Still on track for the March 15 publish date on Reel 1?', 'text', '2026-03-09 14:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Yes confirmed. Zoe submitted her draft this morning — you will receive it for approval by tomorrow EOD.', 'text', '2026-03-09 14:45:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 'Perfect. Really happy with how this campaign is going so far.', 'text', '2026-03-09 15:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-18 16:00:00';

-- conv zoe
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Hey Zoe! Contract fully signed. You are officially on the NovaSkin campaign. First Reel deadline is March 15.', 'text', '2026-02-26 10:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 'Perfect! I have been testing the serum for a week — genuinely love the formula. Makes content easier when you believe in the product.', 'text', '2026-02-26 11:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'That is exactly the energy. Let us know if you need extra product or brand assets.', 'text', '2026-02-26 11:10:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 'Just submitted Reel draft 1! Took it in a lifestyle direction — curious what you think.', 'text', '2026-03-09 09:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Just watched it — lighting is great, lifestyle angle works well. Sharing with Emma now. Feedback by March 11.', 'text', '2026-03-09 09:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 'Great! Happy to adjust if they want tweaks.', 'text', '2026-03-09 09:35:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-19 10:00:00';

-- conv claire
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Hi Claire! The Lumiere x Zoe campaign is live and performing really well. Engagement above benchmark.', 'text', '2026-02-28 10:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), 'I saw the posts — the aesthetic is exactly what we wanted. What are the numbers?', 'text', '2026-02-28 10:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Post 1: 18.7K likes, 7.2% engagement. Post 2: 15.2K likes, 6.8%. Both above the 5% benchmark.', 'text', '2026-02-28 10:40:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='claire@lumierebeauty.com'), 'Those are great numbers. Really happy we went with Influmatch.', 'text', '2026-02-28 11:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Post 3 draft is in review. The Reel is being filmed now — ready for your approval around March 18.', 'text', '2026-02-28 11:10:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-01-23 09:00:00';

-- conv alex
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Hey Alex! Lumiere Holiday wrapped up beautifully. TikTok 1 hit 87K views — way above target.', 'text', '2026-01-05 10:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-05 11:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='alex@alexncreates.com'), 'That campaign was fun to work on. Lumiere gave me creative freedom while being clear on the brief — rare combo.', 'text', '2026-01-05 10:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-05 11:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Exactly what we aim for. Full performance report coming before the debrief.', 'text', '2026-01-05 10:45:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-02-05 11:00:00';

-- conv sam
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Hi Sam! Welcome to Influmatch. Contract for the Spring Radiance campaign with NovaSkin has been sent.', 'text', '2026-03-06 14:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'), 'Got it — reviewing now. The brief looks solid. SPF content is very timely for my audience.', 'text', '2026-03-06 15:00:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Targeting March 28 for Reel 1. About 3 weeks. Does that work?', 'text', '2026-03-06 15:10:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='sam@samfitzbeauty.com'), 'Absolutely. Planning filming next week. How much creative latitude do I have?', 'text', '2026-03-06 15:20:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'NovaSkin is very open to your direction — that is why we matched you. Guidelines are a starting point, not a script.', 'text', '2026-03-06 15:30:00' FROM conversations c WHERE c.type='direct' AND c.created_at='2026-03-06 14:00:00';

-- group conv
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Welcome to the campaign channel! Shared space for NovaSkin, Zoe, and Influmatch throughout the collaboration.', 'text', '2026-02-26 09:15:00' FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 'Hi Zoe! Really looking forward to this. Love your work.', 'text', '2026-02-26 09:30:00' FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='zoe@zoehbeauty.com'), 'Hi Emma! Thank you. I have been testing the serum — week in, skin is noticeably more hydrated. Excited to share it.', 'text', '2026-02-26 09:45:00' FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='emma@novaskin.us'), 'Exactly what we hoped to hear. Feel free to ask anything here.', 'text', '2026-02-26 10:00:00' FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';
INSERT INTO `messages` (`conversation_id`, `sender_id`, `content`, `type`, `created_at`)
SELECT c.id, (SELECT id FROM users WHERE email='lucas.coutardbtr@gmail.com'), 'Reel draft 1 submitted. Emma, you will receive it for review by tomorrow EOD. Feedback window: 48h.', 'text', '2026-03-09 09:35:00' FROM conversations c WHERE c.name='NovaSkin x Zoe - Hydration Serum';

-- ── 12. Messages de contact ──────────────────────────
INSERT INTO `contact_messages`
  (`name`, `email`, `phone`, `subject`, `message`, `is_read`, `created_at`) VALUES
('Rachel Martin', 'rachel@petiteglow.com',   '+1 415 555 0192', 'Brand inquiry',       'Hi, I run Petite Glow, a clean beauty brand in San Francisco. Looking to launch with a structured influencer campaign. How does Influmatch work?',                              1, '2026-03-18 09:30:00'),
('Nina Torres',   'nina@vivid-skin.com',     '+1 646 555 0217', 'Partnership inquiry', 'We are Vivid Skin, a NYC skincare startup. Love the three-party contract concept. Can we schedule a call?',                                                                     1, '2026-03-20 14:15:00'),
('Lea Fontaine',  'lea.fontaine@gmail.com',  '+1 929 555 0341', 'Creator application', 'Beauty creator on Instagram with 22K followers, 8.1% avg engagement. Specializing in skincare. Very interested in joining the Influmatch creator network.',                       0, '2026-03-24 11:00:00'),
('Marcus Webb',   'marcus@bloomlabs.co',     '+1 312 555 0088', 'Brand inquiry',       'Bloom Labs here — science-backed haircare. Interested in creators who can speak to the formulation angle authentically.',                                                          0, '2026-03-26 16:45:00'),
('Priya Sharma',  'priya.creates@gmail.com', '+1 718 555 0463', 'Creator application', 'Lifestyle creator on Instagram and TikTok (34K + 18K). Bad experiences with unstructured deals before. The Influmatch contract model is exactly what I need.',                   0, '2026-03-27 10:20:00');

-- ── Vérification finale ──────────────────────────────
SELECT 'users'            AS tbl, COUNT(*) AS n FROM users
UNION SELECT 'collaborations',    COUNT(*) FROM collaborations
UNION SELECT 'contracts',         COUNT(*) FROM contracts
UNION SELECT 'events',            COUNT(*) FROM events
UNION SELECT 'campaign_tasks',    COUNT(*) FROM campaign_tasks
UNION SELECT 'conversations',     COUNT(*) FROM conversations
UNION SELECT 'conv_participants',  COUNT(*) FROM conversation_participants
UNION SELECT 'messages',          COUNT(*) FROM messages
UNION SELECT 'contact_messages',  COUNT(*) FROM contact_messages;
