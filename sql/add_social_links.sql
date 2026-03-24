-- Ajouter les colonnes réseaux sociaux pour les influenceurs
ALTER TABLE `users`
  ADD COLUMN `instagram` VARCHAR(100) DEFAULT NULL AFTER `avatar`,
  ADD COLUMN `tiktok`    VARCHAR(100) DEFAULT NULL AFTER `instagram`,
  ADD COLUMN `youtube`   VARCHAR(100) DEFAULT NULL AFTER `tiktok`;

-- Migrer les utilisateurs 'client' existants vers 'brand'
UPDATE `users` SET `role` = 'brand' WHERE `role` = 'client';

-- Mettre à jour l'ENUM pour retirer 'client'
ALTER TABLE `users`
  MODIFY COLUMN `role`
    ENUM('admin','user','influencer','brand')
    NOT NULL DEFAULT 'user';
