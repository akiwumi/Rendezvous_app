-- QUICK SETUP: Sokina Bobo Admin User
-- 
-- IMPORTANT: Before running this script:
-- 1. First create the auth user in Supabase Dashboard:
--    - Go to Authentication > Users > Add User
--    - Email: sokina.bobo@example.com (or your preferred email)
--    - Password: demo123 (or your preferred password)
--    - Auto Confirm: YES
--    - Copy the UUID that gets created
--
-- 2. Replace 'YOUR_USER_UUID_HERE' below with the actual UUID from Step 1
--    OR use the UUID provided in this script if you've already created the auth user
--
-- 3. Run this script in Supabase SQL Editor

-- Generate a UUID for Sokina Bobo (or use the one from Supabase Auth)
-- You can use: SELECT gen_random_uuid(); to generate a new one

-- Insert or update admin user profile with FULL ADMIN ACCESS
-- NOTE: This version uses gen_random_uuid() which will create a NEW UUID
-- This means the UUID in the database will NOT match the UUID in Supabase Auth
-- For proper setup, use SETUP_SOKINA_BOBO_SIMPLE.sql instead, which requires the Auth UUID
INSERT INTO users (
  id, 
  email, 
  full_name, 
  phone, 
  address, 
  profile_image, 
  social_links, 
  is_admin,  -- THIS GIVES FULL ADMIN ACCESS
  friends, 
  liked_posts, 
  registered_events, 
  created_at, 
  updated_at,
  last_login
)
VALUES (
  gen_random_uuid(),  -- ⚠️ WARNING: This creates a NEW UUID that won't match Auth UUID
  'sokina.bobo@example.com',  -- Replace with actual email used in Supabase Auth
  'Sokina Bobo',
  '+34 971 999 888',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@sokina_bobo", "facebook": "sokina.bobo", "twitter": "@SokinaBobo", "linkedin": "sokina-bobo"}'::jsonb,
  true,  -- FULL ADMIN ACCESS - Can manage users, posts, events, announcements, invitation codes
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
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  profile_image = EXCLUDED.profile_image,
  social_links = EXCLUDED.social_links,
  is_admin = true,  -- ENSURE ADMIN ACCESS IS ALWAYS SET
  updated_at = NOW();

-- Alternative: If you already have the UUID from Supabase Auth, use this version:
-- Replace 'YOUR_UUID_HERE' with the actual UUID from Supabase Auth
/*
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
  'YOUR_UUID_HERE'::uuid,  -- Replace with UUID from Supabase Auth
  'sokina.bobo@example.com',  -- Replace with actual email
  'Sokina Bobo',
  '+34 971 999 888',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@sokina_bobo", "facebook": "sokina.bobo", "twitter": "@SokinaBobo", "linkedin": "sokina-bobo"}'::jsonb,
  true,
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
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  profile_image = EXCLUDED.profile_image,
  social_links = EXCLUDED.social_links,
  is_admin = true,
  updated_at = NOW();
*/

-- Verify the user was created correctly
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
WHERE email = 'sokina.bobo@example.com' OR full_name = 'Sokina Bobo';

