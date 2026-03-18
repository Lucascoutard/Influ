-- ===================================================
--  SQL/CAMPAIGN_TASKS_TABLE.SQL
--  Tableau de suivi de campagne (style Monday.com)
--  À exécuter dans phpMyAdmin sur la base influmatch
-- ===================================================

CREATE TABLE IF NOT EXISTS `campaign_tasks` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `collab_id`     INT UNSIGNED NOT NULL,
  `title`         VARCHAR(255) NOT NULL,
  `content_type`  VARCHAR(100) DEFAULT NULL COMMENT 'reel, photo, story, youtube, podcast…',
  `platform`      VARCHAR(50)  DEFAULT NULL COMMENT 'instagram, tiktok, youtube, linkedin…',
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
