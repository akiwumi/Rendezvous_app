-- Diagnostic Script: Check Eugene Akiwumi Setup
-- Run this in Supabase SQL Editor to verify everything is configured correctly

-- 1. Check if user exists in database
SELECT 
  'Database Check' as check_type,
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users 
WHERE email = 'akiwumi@gmail.com';

-- 2. Check if user has correct UUID
SELECT 
  'UUID Check' as check_type,
  CASE 
    WHEN id = '055f4406-9903-467d-9b28-8701765201df'::uuid THEN '✅ UUID matches'
    ELSE '❌ UUID does not match: ' || id::text
  END as status
FROM users 
WHERE email = 'akiwumi@gmail.com';

-- 3. Check if user is admin
SELECT 
  'Admin Check' as check_type,
  CASE 
    WHEN is_admin = true THEN '✅ User is admin'
    ELSE '❌ User is NOT admin - updating...'
  END as status
FROM users 
WHERE email = 'akiwumi@gmail.com';

-- 4. Fix admin status if needed
UPDATE users 
SET is_admin = true 
WHERE email = 'akiwumi@gmail.com' AND (is_admin IS NULL OR is_admin = false);

-- 5. Verify admin status after update
SELECT 
  'Admin Status Fixed' as check_type,
  id,
  email,
  is_admin
FROM users 
WHERE email = 'akiwumi@gmail.com';

