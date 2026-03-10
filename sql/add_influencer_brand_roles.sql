-- ===================================================
--  SQL/ADD_INFLUENCER_BRAND_ROLES.SQL
--  Ajoute les rôles 'influencer' et 'brand' à la table users
--  À exécuter dans phpMyAdmin sur la base influmatch
-- ===================================================

ALTER TABLE `users`
  MODIFY COLUMN `role`
    ENUM('admin','client','user','influencer','brand')
    NOT NULL DEFAULT 'user';
