-- ===================================================
--  INFLUMATCH — Collaborations
--  Exécuter dans la base `influmatch`
-- ===================================================

CREATE TABLE IF NOT EXISTS collaborations (
  id             INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  title          VARCHAR(255)      NOT NULL,
  brand_id       INT UNSIGNED      NOT NULL,          -- client / marque
  influencer_id  INT UNSIGNED      NOT NULL,          -- influenceur
  created_by     INT UNSIGNED      NOT NULL,          -- admin ayant créé
  status         ENUM('pending','active','completed','cancelled')
                                   NOT NULL DEFAULT 'pending',
  budget         DECIMAL(10,2)     DEFAULT NULL,
  start_date     DATE              DEFAULT NULL,
  end_date       DATE              DEFAULT NULL,
  description    TEXT              DEFAULT NULL,
  created_at     TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  FOREIGN KEY (brand_id)      REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (influencer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by)    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
