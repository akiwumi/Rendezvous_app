-- Create/Update Admin User: Eugene Akiwumi (Pebbles)
-- Email: akiwumi@gmail.com
-- Login: akiwumi@gmail.com
-- Password: 1234
-- Profile Image: /eugene-akiwumi.png

-- STEP 1: First, you need to create the user in Supabase Auth manually:
-- Go to Supabase Dashboard > Authentication > Users > Add User
-- Email: akiwumi@gmail.com
-- Password: 123456
-- Auto Confirm User: Yes
-- Copy the User UUID that gets created

-- STEP 2: Replace 'YOUR_USER_UUID_HERE' below with the actual UUID from Step 1
-- Then run this SQL script

-- Insert or update admin user profile
INSERT INTO users (id, email, full_name, phone, address, profile_image, social_links, is_admin, friends, liked_posts, registered_events, created_at, updated_at)
VALUES (
  '055f4406-9903-467d-9b28-8701765201df'::uuid,
  'akiwumi@gmail.com',
  'Eugene Akiwumi',
  '+34 971 123 456',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@pebbles_rendezvous", "facebook": "eugene.akiwumi", "twitter": "@PebblesRSC", "linkedin": "eugene-akiwumi"}'::jsonb,
  true,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
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
  is_admin = EXCLUDED.is_admin,
  updated_at = NOW();

-- Alternative: If you want to update existing admin user by email
-- UPDATE users 
-- SET 
--   full_name = 'Eugene Akiwumi',
--   email = 'akiwumi@gmail.com',
--   profile_image = '/eugene-akiwumi.png',
--   social_links = '{"instagram": "@pebbles_rendezvous", "facebook": "eugene.akiwumi", "twitter": "@PebblesRSC", "linkedin": "eugene-akiwumi"}'::jsonb,
--   updated_at = NOW()
-- WHERE email = 'akiwumi@icloud.com' OR email = 'akiwumi@gmail.com';

