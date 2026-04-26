-- Add address/location fields to users table
ALTER TABLE `users`
  ADD COLUMN `address` VARCHAR(255) DEFAULT NULL AFTER `company`,
  ADD COLUMN `city`    VARCHAR(100) DEFAULT NULL AFTER `address`,
  ADD COLUMN `state`   VARCHAR(100) DEFAULT NULL AFTER `city`,
  ADD COLUMN `zip`     VARCHAR(20)  DEFAULT NULL AFTER `state`,
  ADD COLUMN `country` VARCHAR(100) DEFAULT NULL AFTER `zip`;
