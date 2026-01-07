-- Complete Migration Script for Rendezvous Social Club
-- Run this SQL in your Supabase SQL Editor to update your database
-- This includes all recent updates including post enhancements

-- ============================================
-- 1. POSTS TABLE MIGRATION
-- ============================================
-- Add new columns to posts table for enhanced post features
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interested_users TEXT[] DEFAULT '{}';

-- Update existing posts to have 'regular' as post_type if null
UPDATE posts SET post_type = 'regular' WHERE post_type IS NULL;

-- ============================================
-- 2. ENSURE INVITATION CODES ARE SET UP
-- ============================================
-- Insert default invitation code if it doesn't exist
INSERT INTO invitation_codes (code, active, max_uses, used_count) 
VALUES ('RENDEZVOUS2025', true, NULL, 0)
ON CONFLICT (code) DO UPDATE SET active = true;

-- ============================================
-- 3. UPDATE RLS POLICIES FOR POSTS
-- ============================================
-- Ensure users can update their own posts (for likes, comments, interested_users)
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts 
FOR UPDATE USING (
  auth.uid()::text = author_id::text OR
  EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_admin = true)
);

-- Allow users to update posts for interactions (likes, comments, interested_users)
-- This allows any authenticated user to update likes, comments, and interested_users arrays
DROP POLICY IF EXISTS "Users can interact with posts" ON posts;
CREATE POLICY "Users can interact with posts" ON posts 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- 4. ENSURE USERS TABLE HAS ALL REQUIRED FIELDS
-- ============================================
-- Verify all columns exist (they should from the schema, but this ensures they're there)
DO $$ 
BEGIN
  -- Check and add columns if they don't exist (should already be in schema)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'bio') THEN
    ALTER TABLE users ADD COLUMN bio TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'liked_posts') THEN
    ALTER TABLE users ADD COLUMN liked_posts TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'registered_events') THEN
    ALTER TABLE users ADD COLUMN registered_events TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================
-- Index for post_type queries
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);
-- Index for event_date queries
CREATE INDEX IF NOT EXISTS idx_posts_event_date ON posts(event_date);
-- Index for author queries
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
-- Index for user email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 6. VERIFY ADMIN USER EXISTS
-- ============================================
-- Note: Make sure the admin user with UUID 'd8750992-cb10-485d-8d45-2746af3db391'
-- exists in auth.users and has a corresponding entry in the users table
-- This should be done manually or via the seed data script

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- After running this migration:
-- 1. Verify posts table has all new columns
-- 2. Test post creation with new fields
-- 3. Test user registration with password
-- 4. Verify invitation codes are working

