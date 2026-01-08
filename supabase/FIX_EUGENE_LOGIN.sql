-- Quick Fix Script: Ensure Eugene Akiwumi Can Login
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists in database
SELECT 
  'Current Status' as step,
  id,
  email,
  full_name,
  is_admin,
  CASE 
    WHEN id IS NULL THEN '❌ USER NOT FOUND'
    WHEN is_admin = true THEN '✅ User exists and is admin'
    ELSE '⚠️ User exists but NOT admin'
  END as status
FROM users 
WHERE email = 'akiwumi@gmail.com';

-- Step 2: If user doesn't exist, insert it
-- First, get the UUID from Supabase Auth (go to Authentication > Users > find akiwumi@gmail.com > copy UUID)
-- Replace '055f4406-9903-467d-9b28-8701765201df' with the actual UUID from Auth

INSERT INTO users (
  id, 
  email, 
  full_name, 
  phone, 
  address, 
  profile_image, 
  social_links, 
  is_admin,
  friends, 
  liked_posts, 
  registered_events, 
  created_at, 
  updated_at,
  last_login
)
VALUES (
  '055f4406-9903-467d-9b28-8701765201df'::uuid,  -- IMPORTANT: Replace with actual UUID from Auth
  'akiwumi@gmail.com',
  'Eugene Akiwumi',
  '+34 971 123 456',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@pebbles_rendezvous", "facebook": "eugene.akiwumi", "twitter": "@PebblesRSC", "linkedin": "eugene-akiwumi"}'::jsonb,
  true,  -- MUST be true for admin access
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_admin = true,  -- Ensure admin status
  updated_at = NOW();

-- Step 3: Update existing user if UUID is wrong
-- If the user exists but UUID doesn't match, we need to update it
-- First, get the correct UUID from Supabase Auth

-- Uncomment and run this if you need to update the UUID:
-- UPDATE users 
-- SET id = 'YOUR_AUTH_UUID_HERE'::uuid
-- WHERE email = 'akiwumi@gmail.com';

-- Step 4: Verify the fix
SELECT 
  'After Fix' as step,
  id,
  email,
  full_name,
  is_admin,
  CASE 
    WHEN is_admin = true THEN '✅ READY TO LOGIN'
    ELSE '❌ STILL NOT ADMIN'
  END as status
FROM users 
WHERE email = 'akiwumi@gmail.com';

-- Step 5: Check RLS policies (should allow authenticated users to read their own data)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users' 
AND policyname LIKE '%read%' OR policyname LIKE '%select%';

