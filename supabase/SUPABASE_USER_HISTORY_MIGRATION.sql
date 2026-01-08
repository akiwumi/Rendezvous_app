-- Migration: Add last_login and usage tracking to users table
-- This allows tracking user activity and implementing auto-login

-- Add last_login timestamp
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add index for last_login queries
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);

-- Update existing users to have last_login = created_at if null
UPDATE users SET last_login = created_at WHERE last_login IS NULL;

