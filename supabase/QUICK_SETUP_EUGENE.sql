-- QUICK SETUP: Eugene Akiwumi Admin User
-- 
-- IMPORTANT: Before running this script:
-- 1. First create the auth user in Supabase Dashboard:
--    - Go to Authentication > Users > Add User
--    - Email: akiwumi@gmail.com
--    - Password: 1234
--    - Auto Confirm: YES
--    - Copy the UUID that gets created
--
-- 2. Replace 'YOUR_USER_UUID_HERE' below with the actual UUID from Step 1
--
-- 3. Run this script in Supabase SQL Editor

-- Insert or update admin user profile with FULL ADMIN ACCESS
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
  '055f4406-9903-467d-9b28-8701765201df'::uuid,
  'akiwumi@gmail.com',
  'Eugene Akiwumi',
  '+34 971 123 456',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@pebbles_rendezvous", "facebook": "eugene.akiwumi", "twitter": "@PebblesRSC", "linkedin": "eugene-akiwumi"}'::jsonb,
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

-- Verify the user was created correctly
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
WHERE email = 'akiwumi@gmail.com';

