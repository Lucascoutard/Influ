-- =====================================================
-- INFLUMATCH — TABLES DE MESSAGERIE
-- À exécuter dans PHPMyAdmin après influmatch_db.sql
-- =====================================================

CREATE TABLE IF NOT EXISTS conversations (
  id          INT UNSIGNED AUTO_INCREMENT  PRIMARY KEY,
  name        VARCHAR(255)        NULL     COMMENT 'Nom pour les groupes uniquement',
  type        ENUM('direct','group') NOT NULL DEFAULT 'direct',
  created_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id  INT UNSIGNED  NOT NULL,
  user_id          INT UNSIGNED  NOT NULL,
  joined_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_read_msg_id INT UNSIGNED  NOT NULL DEFAULT 0,
  PRIMARY KEY (conversation_id, user_id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)         REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id               INT UNSIGNED AUTO_INCREMENT  PRIMARY KEY,
  conversation_id  INT UNSIGNED                 NOT NULL,
  sender_id        INT UNSIGNED                 NOT NULL,
  content          TEXT                NULL,
  type             ENUM('text','image','file') NOT NULL DEFAULT 'text',
  file_name        VARCHAR(255)        NULL,
  file_path        VARCHAR(500)        NULL,
  file_size        INT UNSIGNED        NULL,
  created_at       TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE,
  INDEX idx_conv_time (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
