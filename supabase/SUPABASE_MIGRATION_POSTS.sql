-- Migration: Add new fields to posts table
-- Run this SQL in your Supabase SQL Editor to update existing posts table

-- Add new columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS event_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS interested_users TEXT[] DEFAULT '{}';

-- Update existing posts to have 'regular' as post_type if null
UPDATE posts SET post_type = 'regular' WHERE post_type IS NULL;

