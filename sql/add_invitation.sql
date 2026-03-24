-- =====================================================
-- Invitation-based passkey-only account system
-- Run once in phpMyAdmin or CLI
-- =====================================================

-- Make password nullable (passkeys-only, no password)
ALTER TABLE users
  MODIFY COLUMN password VARCHAR(255) NULL;

-- Add invitation token columns
ALTER TABLE users
  ADD COLUMN invitation_token    VARCHAR(128) NULL AFTER verification_token,
  ADD COLUMN invitation_expires_at DATETIME   NULL AFTER invitation_token;

-- Index for fast token lookup
CREATE INDEX idx_invitation_token ON users (invitation_token);
