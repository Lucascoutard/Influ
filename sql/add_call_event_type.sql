-- ===================================================
--  ADD_CALL_EVENT_TYPE.SQL
--  Ajoute le type 'call_event' à la table messages
--  Exécuter dans phpMyAdmin ou via mysql CLI
-- ===================================================

ALTER TABLE `messages`
  MODIFY COLUMN `type`
    ENUM('text','image','file','call_event') NOT NULL DEFAULT 'text';
