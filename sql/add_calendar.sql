-- ===================================================
--  ADD_CALENDAR.SQL — Table événements / planning
--  Exécuter dans phpMyAdmin ou via mysql CLI
-- ===================================================

CREATE TABLE IF NOT EXISTS events (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  type        ENUM('call','meeting','demo','other') NOT NULL DEFAULT 'call',
  start_at    DATETIME NOT NULL,
  end_at      DATETIME DEFAULT NULL,
  location    VARCHAR(255) DEFAULT NULL,
  client_id   INT UNSIGNED DEFAULT NULL,
  created_by  INT UNSIGNED NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_start (start_at),
  CONSTRAINT fk_event_client  FOREIGN KEY (client_id)  REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
