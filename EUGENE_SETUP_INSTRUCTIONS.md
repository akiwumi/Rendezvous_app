# Eugene Akiwumi Admin Setup Instructions

## Step 1: Create Auth User in Supabase Dashboard

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **Add User** (or **Invite User** button)
5. Fill in the form:
   - **Email**: `akiwumi@gmail.com`
   - **Password**: `1234`
   - **Auto Confirm User**: ✅ **YES** (This is important!)
   - **Send Invite Email**: ❌ No (optional)
6. Click **Create User**
7. **IMPORTANT**: Copy the **User UUID** that appears after creation (you'll need it for Step 2)

## Step 2: Create User Profile in Database

1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/SUPABASE_ADMIN_EUGENE.sql`
3. Find the line with `'YOUR_USER_UUID_HERE'::uuid`
4. Replace `YOUR_USER_UUID_HERE` with the actual UUID from Step 1
5. Copy the entire updated SQL script
6. Paste it into the SQL Editor
7. Click **Run** to execute the script

The SQL script will:
- Create Eugene Akiwumi's profile in the `users` table
- Set `is_admin = true` for full admin access
- Add all profile information (name, email, phone, address, social links)
- Set profile image to `/pebbles.jpg`

## Step 3: Verify Setup

1. **Test Login**:
   - Go to your app: `http://localhost:5173`
   - Navigate to Login page
   - Login with:
     - Email: `akiwumi@gmail.com`
     - Password: `1234`
   - You should be redirected to the announcements/feed page

2. **Verify Admin Access**:
   - Navigate to Admin Profile page (`/admin-profile`)
   - You should see Eugene Akiwumi's full profile
   - Check that you have access to:
     - ✅ Create Posts button
     - ✅ Invitations tab
     - ✅ All admin tabs (About, Events, Posts, Gallery, Friends, Invitations)
     - ✅ Admin statistics (Events Hosted, Members, Years Active, Countries)

3. **Test Admin Functions**:
   - Create a new post (click "Create Post" button)
   - Generate an invitation code (go to Invitations tab)
   - Verify you can see all members in the Friends tab

## Admin Capabilities

As Eugene Akiwumi (admin), you have full access to:

### User Management
- ✅ View all members
- ✅ Delete users (via adminService.deleteUser)
- ✅ Update user roles

### Content Management
- ✅ Create posts (Events, Announcements, Regular posts)
- ✅ Delete posts
- ✅ Delete events
- ✅ Delete announcements
- ✅ View all content with admin privileges

### Invitation Management
- ✅ Generate invitation codes
- ✅ Set max uses and expiration dates
- ✅ Activate/deactivate codes
- ✅ Track code usage

### Statistics
- ✅ View live statistics (events hosted, members connected, etc.)
- ✅ Access all admin analytics

## Troubleshooting

### Login fails
- **Check**: User exists in Supabase Auth with email `akiwumi@gmail.com`
- **Check**: Password is set to `1234`
- **Check**: User is "Confirmed" (Auto Confirm was set to Yes)
- **Solution**: If not confirmed, go to Auth → Users → Find user → Click "Confirm" button

### Admin profile doesn't load
- **Check**: User profile exists in `users` table with email `akiwumi@gmail.com`
- **Check**: `is_admin` field is set to `true` in database
- **Check**: UUID matches between Auth user and users table
- **Solution**: Re-run the SQL script with correct UUID

### Can't access admin features
- **Check**: `currentUser.isAdmin === true` in browser console
- **Check**: User profile in database has `is_admin = true`
- **Solution**: Update the user record: `UPDATE users SET is_admin = true WHERE email = 'akiwumi@gmail.com';`

## Quick SQL Commands

### Check if user exists:
```sql
SELECT id, email, full_name, is_admin 
FROM users 
WHERE email = 'akiwumi@gmail.com';
```

### Make existing user admin:
```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'akiwumi@gmail.com';
```

### Delete and recreate (if needed):
```sql
DELETE FROM users WHERE email = 'akiwumi@gmail.com';
-- Then run SUPABASE_ADMIN_EUGENE.sql again
```

