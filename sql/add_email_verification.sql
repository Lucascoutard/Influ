-- ===================================================
--  MIGRATION : Vérification email + rétention
--  À exécuter une seule fois via phpMyAdmin
-- ===================================================

-- Étape 1 — Colonnes vérification email (déjà faites si erreur #1060 → passer à l'étape 2)
ALTER TABLE `users`
  ADD COLUMN `email_verified`      TINYINT(1)  NOT NULL DEFAULT 1   AFTER `is_active`,
  ADD COLUMN `verification_token`  VARCHAR(64) DEFAULT NULL          AFTER `email_verified`,
  ADD COLUMN `token_expires_at`    DATETIME    DEFAULT NULL          AFTER `verification_token`,
  ADD INDEX  `idx_verif_token`    (`verification_token`);

-- Étape 2 — Colonnes emails de prévention rétention (à exécuter séparément)
ALTER TABLE `users`
  ADD COLUMN `warned_deactivation`  TINYINT(1) NOT NULL DEFAULT 0 AFTER `token_expires_at`,
  ADD COLUMN `warned_anonymization` TINYINT(1) NOT NULL DEFAULT 0 AFTER `warned_deactivation`;
