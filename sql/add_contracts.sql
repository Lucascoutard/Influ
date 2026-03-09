-- ===================================================
--  INFLUMATCH — Contrats
--  Exécuter dans la base `influmatch`
-- ===================================================

CREATE TABLE IF NOT EXISTS contracts (
  id             INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  collab_id      INT UNSIGNED      NULL,             -- collaboration liée (optionnel)
  client_id      INT UNSIGNED      NOT NULL,         -- client destinataire
  created_by     INT UNSIGNED      NOT NULL,         -- admin créateur
  title          VARCHAR(255)      NOT NULL,
  description    TEXT              DEFAULT NULL,
  unsigned_path  VARCHAR(512)      NOT NULL,         -- chemin PDF non signé
  signed_path    VARCHAR(512)      DEFAULT NULL,     -- chemin PDF signé (upload client)
  status         ENUM('pending','signed','rejected') NOT NULL DEFAULT 'pending',
  email_sent     TINYINT(1)        NOT NULL DEFAULT 0,
  signed_at      TIMESTAMP         NULL DEFAULT NULL,
  created_at     TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (collab_id)  REFERENCES collaborations(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id)  REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajouter la colonne digest email sur les utilisateurs
-- (pour tracker quand le dernier digest a été envoyé)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_email_digest TIMESTAMP NULL DEFAULT NULL;
