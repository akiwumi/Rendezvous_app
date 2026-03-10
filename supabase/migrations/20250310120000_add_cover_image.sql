-- Add cover_image column to users table for profile header/banner
-- Run in Supabase Dashboard > SQL Editor

ALTER TABLE users
ADD COLUMN IF NOT EXISTS cover_image text DEFAULT '';
