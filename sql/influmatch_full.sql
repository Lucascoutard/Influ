-- ===================================================
--  INFLUMATCH — SCHÉMA COMPLET
--  Généré le 2026-03-09
--  Importer via phpMyAdmin > onglet "Importer"
--  ou : mysql -u root influmatch < influmatch_full.sql
-- ===================================================

CREATE DATABASE IF NOT EXISTS `influmatch`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `influmatch`;

-- ===================================================
--  1. UTILISATEURS
-- ===================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id`                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `firstname`         VARCHAR(100)  NOT NULL,
  `lastname`          VARCHAR(100)  NOT NULL,
  `email`             VARCHAR(255)  NOT NULL UNIQUE,
  `password`          VARCHAR(255)  NOT NULL,
  `role`              ENUM('admin','client','user') NOT NULL DEFAULT 'user',
  `phone`             VARCHAR(20)   DEFAULT NULL,
  `company`           VARCHAR(255)  DEFAULT NULL,
  `is_active`         TINYINT(1)    NOT NULL DEFAULT 1,
  `last_login`        DATETIME      DEFAULT NULL,
  `last_email_digest` TIMESTAMP     NULL DEFAULT NULL,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_role`   (`role`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  2. MESSAGES DE CONTACT (formulaire public)
-- ===================================================
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED DEFAULT NULL,
  `name`       VARCHAR(200) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `phone`      VARCHAR(20)  DEFAULT NULL,
  `subject`    VARCHAR(255) NOT NULL,
  `message`    TEXT         NOT NULL,
  `is_read`    TINYINT(1)   NOT NULL DEFAULT 0,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_read` (`is_read`),
  CONSTRAINT `fk_contact_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  3. COLLABORATIONS
-- ===================================================
CREATE TABLE IF NOT EXISTS `collaborations` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`         VARCHAR(255) NOT NULL,
  `brand_id`      INT UNSIGNED NOT NULL,   -- client / marque
  `influencer_id` INT UNSIGNED NOT NULL,   -- influenceur
  `created_by`    INT UNSIGNED NOT NULL,   -- admin ayant créé
  `status`        ENUM('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
  `budget`        DECIMAL(10,2) DEFAULT NULL,
  `start_date`    DATE          DEFAULT NULL,
  `end_date`      DATE          DEFAULT NULL,
  `description`   TEXT          DEFAULT NULL,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_collab_brand`      FOREIGN KEY (`brand_id`)      REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_influencer` FOREIGN KEY (`influencer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_collab_creator`    FOREIGN KEY (`created_by`)    REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  4. CONTRATS
-- ===================================================
CREATE TABLE IF NOT EXISTS `contracts` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `collab_id`     INT UNSIGNED NULL,             -- collaboration liée (optionnel)
  `client_id`     INT UNSIGNED NOT NULL,         -- client destinataire
  `created_by`    INT UNSIGNED NOT NULL,         -- admin créateur
  `title`         VARCHAR(255) NOT NULL,
  `description`   TEXT         DEFAULT NULL,
  `unsigned_path` VARCHAR(512) NOT NULL,         -- chemin PDF non signé
  `signed_path`   VARCHAR(512) DEFAULT NULL,     -- chemin PDF signé (upload client)
  `status`        ENUM('pending','signed','rejected') NOT NULL DEFAULT 'pending',
  `email_sent`    TINYINT(1)   NOT NULL DEFAULT 0,
  `signed_at`     TIMESTAMP    NULL DEFAULT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_contract_collab`  FOREIGN KEY (`collab_id`)  REFERENCES `collaborations`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_contract_client`  FOREIGN KEY (`client_id`)  REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_contract_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  5. ÉVÉNEMENTS / PLANNING (calendrier)
-- ===================================================
CREATE TABLE IF NOT EXISTS `events` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT         DEFAULT NULL,
  `type`        ENUM('call','meeting','demo','other') NOT NULL DEFAULT 'call',
  `start_at`    DATETIME     NOT NULL,
  `end_at`      DATETIME     DEFAULT NULL,
  `location`    VARCHAR(255) DEFAULT NULL,
  `client_id`   INT UNSIGNED DEFAULT NULL,
  `created_by`  INT UNSIGNED NOT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_start` (`start_at`),
  CONSTRAINT `fk_event_client`  FOREIGN KEY (`client_id`)  REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_event_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  6. MESSAGERIE — Conversations
-- ===================================================
CREATE TABLE IF NOT EXISTS `conversations` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(255) NULL     COMMENT 'Nom pour les groupes uniquement',
  `type`       ENUM('direct','group') NOT NULL DEFAULT 'direct',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  7. MESSAGERIE — Participants
-- ===================================================
CREATE TABLE IF NOT EXISTS `conversation_participants` (
  `conversation_id`  INT UNSIGNED NOT NULL,
  `user_id`          INT UNSIGNED NOT NULL,
  `joined_at`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_read_msg_id` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`conversation_id`, `user_id`),
  CONSTRAINT `fk_cp_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`)         REFERENCES `users`(`id`)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  8. MESSAGERIE — Messages
-- ===================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED NOT NULL,
  `sender_id`       INT UNSIGNED NOT NULL,
  `content`         TEXT         NULL,
  `type`            ENUM('text','image','file','call_event') NOT NULL DEFAULT 'text',
  `file_name`       VARCHAR(255) NULL,
  `file_path`       VARCHAR(500) NULL,
  `file_size`       INT UNSIGNED NULL,
  `created_at`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conv_time` (`conversation_id`, `created_at`),
  CONSTRAINT `fk_msg_conv`   FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`)       REFERENCES `users`(`id`)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  9. APPELS VIDÉO — Signaux WebRTC
-- ===================================================
CREATE TABLE IF NOT EXISTS `call_signals` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT             NOT NULL,
  `sender_id`       INT             NOT NULL,
  `type`            ENUM('offer','answer','ice_candidate','hangup','reject') NOT NULL,
  `payload`         LONGTEXT        NOT NULL,
  `created_at`      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conv_created` (`conversation_id`, `created_at`),
  INDEX `idx_created`      (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
--  COMPTE ADMIN PAR DÉFAUT
--  Email    : admin@influmatch.com
--  Mot de passe : Admin123!
-- ===================================================
INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`, `role`, `is_active`)
SELECT 'Admin', 'Influmatch', 'admin@influmatch.com',
       '$2y$10$YF1JhBPDKxGKGQvJp3rMeOZqEcN6lXkRjXq0bFmGZ8nMvU9HK2AXe',
       'admin', 1
WHERE NOT EXISTS (
  SELECT 1 FROM `users` WHERE `email` = 'admin@influmatch.com'
);
