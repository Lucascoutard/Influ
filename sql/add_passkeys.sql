-- =====================================================
-- Passkey / WebAuthn credentials
-- Run once in phpMyAdmin or CLI
-- =====================================================

CREATE TABLE IF NOT EXISTS passkey_credentials (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT UNSIGNED NOT NULL,
    credential_id VARCHAR(512) NOT NULL,
    public_key    TEXT NOT NULL,
    sign_count    INT UNSIGNED DEFAULT 0,
    device_name   VARCHAR(100) DEFAULT 'My passkey',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at  TIMESTAMP NULL,
    UNIQUE KEY uq_credential_id (credential_id(255)),
    INDEX idx_user_passkeys (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
