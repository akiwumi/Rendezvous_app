-- SIMPLE SETUP: Sokina Bobo Admin User
-- 
-- STEP 1: Create the auth user in Supabase Dashboard first:
--   Authentication > Users > Add User
--   Email: sokina.bobo@example.com
--   Password: demo123
--   Auto Confirm: YES
--   Copy the UUID shown
--
-- STEP 2: Replace 'YOUR_UUID_FROM_AUTH' below with the UUID from Step 1
-- STEP 3: Run this script

-- Option A: If you have the UUID from Supabase Auth (RECOMMENDED)
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
  'YOUR_UUID_FROM_AUTH'::uuid,  -- ⚠️ REPLACE THIS with UUID from Supabase Auth
  'sokina.bobo@example.com',     -- ⚠️ REPLACE if you used different email
  'Sokina Bobo',
  '+34 971 999 888',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@sokina_bobo", "facebook": "sokina.bobo", "twitter": "@SokinaBobo", "linkedin": "sokina-bobo"}'::jsonb,
  true,  -- ✅ FULL ADMIN ACCESS
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
  is_admin = true,  -- ✅ ENSURE ADMIN ACCESS
  updated_at = NOW();

-- Verify the setup
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
WHERE full_name = 'Sokina Bobo';

-- Expected result: One row with is_admin = true

