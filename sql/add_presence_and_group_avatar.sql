-- ===================================================
--  SQL/ADD_PRESENCE_AND_GROUP_AVATAR.SQL
--  1. Présence en temps réel (pastille en ligne)
--  2. Avatar pour les conversations de groupe
--  À exécuter dans phpMyAdmin sur la base influmatch
-- ===================================================

-- Présence utilisateur (mise à jour via heartbeat JS toutes les 30s)
ALTER TABLE `users`
  ADD COLUMN `last_seen` DATETIME DEFAULT NULL;

-- Photo de groupe (chemin vers l'image uploadée)
ALTER TABLE `conversations`
  ADD COLUMN `avatar` VARCHAR(255) DEFAULT NULL;
