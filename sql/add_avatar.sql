-- Ajouter la colonne avatar à la table users
ALTER TABLE `users`
  ADD COLUMN `avatar` VARCHAR(255) DEFAULT NULL
  AFTER `company`;
