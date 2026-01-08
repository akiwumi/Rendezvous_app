# Setup Instructions: Sokina Bobo Admin User

This guide will help you create the Sokina Bobo admin user in Supabase with full admin access.

## Step 1: Create Auth User in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** or **"Create User"**
4. Fill in the following:
   - **Email**: `sokina.bobo@example.com` (or your preferred email)
   - **Password**: `demo123` (or your preferred password)
   - **Auto Confirm User**: ✅ **YES** (Important!)
5. Click **"Create User"**
6. **Copy the UUID** that appears in the user list (you'll need this for Step 2)

## Step 2: Run SQL Script

1. Go to **SQL Editor** in Supabase Dashboard
2. Open the file `supabase/QUICK_SETUP_SOKINA_BOBO.sql`
3. **IMPORTANT**: Replace `gen_random_uuid()` with the actual UUID from Step 1, OR replace `'YOUR_UUID_HERE'` if using the alternative version
4. Also update the email address if you used a different one in Step 1
5. Run the SQL script

## Step 3: Verify Setup

After running the SQL script, verify the user was created:

```sql
SELECT 
  id,
  email,
  full_name,
  is_admin,
  created_at
FROM users
WHERE email = 'sokina.bobo@example.com' OR full_name = 'Sokina Bobo';
```

You should see:
- `is_admin` = `true`
- `full_name` = `Sokina Bobo`
- Your email address

## Step 4: Login

You can now login with:
- **Email**: `sokina.bobo@example.com` (or the email you used)
- **Password**: `demo123` (or the password you set)

The system will automatically recognize Sokina Bobo as an admin user and grant full admin access.

## Admin Access Features

With `is_admin = true`, Sokina Bobo will have access to:
- ✅ Create, edit, and delete posts
- ✅ Create, edit, and delete events
- ✅ Create, edit, and delete announcements
- ✅ Manage invitation codes
- ✅ View and manage all users
- ✅ Access admin profile page
- ✅ Full access to all admin tools

## Troubleshooting

### User not found error
- Make sure you created the auth user in Step 1
- Verify the UUID matches between Auth and the database

### Email not confirmed
- In Supabase Dashboard → Authentication → Users
- Find Sokina Bobo's user
- Click the **"Confirm"** button if it shows as unconfirmed

### Can't login
- Check that `is_admin = true` in the database
- Verify the email and password match what you set in Auth
- Check browser console for detailed error messages

### Profile not created
- Check RLS (Row Level Security) policies in Supabase
- Ensure the `users` table allows inserts
- Verify the UUID format is correct (should be a valid UUID)

## Alternative: Quick Setup with Known UUID

If you already have the UUID from Supabase Auth, you can use this simplified version:

```sql
-- Replace 'YOUR_UUID_HERE' with the actual UUID
INSERT INTO users (
  id, email, full_name, phone, address, profile_image, 
  social_links, is_admin, friends, liked_posts, registered_events, 
  created_at, updated_at, last_login
)
VALUES (
  'YOUR_UUID_HERE'::uuid,
  'sokina.bobo@example.com',
  'Sokina Bobo',
  '+34 971 999 888',
  'Palma de Mallorca, Spain',
  '/pebbles.jpg',
  '{"instagram": "@sokina_bobo"}'::jsonb,
  true,  -- ADMIN ACCESS
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET is_admin = true, updated_at = NOW();
```

