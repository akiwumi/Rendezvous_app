# Complete Supabase Setup Guide

## Overview
This guide will help you set up the Rendezvous app to load all data from Supabase, removing local dummy data dependencies.

## Step 1: Set Up Admin User (Eugene Akiwumi)

### 1.1 Create Admin Auth User
1. Go to Supabase Dashboard > **Authentication** > **Users**
2. Click **Add User** (or **Invite User**)
3. Fill in:
   - **Email**: `akiwumi@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ Yes
   - **Send Invite Email**: ❌ No
4. Click **Create User**
5. **Copy the User UUID** (you'll need this for the next step)

### 1.2 Insert Admin Profile
1. Open `supabase/SUPABASE_ADMIN_EUGENE.sql`
2. Replace `'YOUR_USER_UUID_HERE'` with the UUID from Step 1.1
3. Run the SQL script in Supabase SQL Editor

## Step 2: Create 6 Demo Users

### 2.1 Create Demo Auth Users
Create these 6 users in Supabase Auth (same process as admin):
1. **Marcus von Habsburg**
   - Email: `marcus.vonhabsburg@email.com`
   - Password: `demo123`

2. **Isabella Rossi**
   - Email: `isabella.rossi@email.com`
   - Password: `demo123`

3. **James Chen**
   - Email: `james.chen@email.com`
   - Password: `demo123`

4. **Sophie Laurent**
   - Email: `sophie.laurent@email.com`
   - Password: `demo123`

5. **Thomas Müller**
   - Email: `thomas.mueller@email.com`
   - Password: `demo123`

6. **Maria Santos**
   - Email: `maria.santos@email.com`
   - Password: `demo123`

### 2.2 Insert Demo User Profiles
1. Open `supabase/SUPABASE_DEMO_USERS.sql`
2. For each user, replace the UUID placeholder with the actual UUID from Supabase Auth
3. Run the SQL script in Supabase SQL Editor

## Step 3: Verify Setup

### 3.1 Test Admin Login
1. Start the app: `npm run dev`
2. Navigate to login page
3. Login with:
   - Email: `akiwumi@gmail.com`
   - Password: `123456`
4. Verify:
   - You're logged in successfully
   - Admin profile page loads correctly
   - All tabs are accessible
   - Invitation codes tab works

### 3.2 Test Demo User Login
1. Logout (or use incognito window)
2. Login with any demo user:
   - Email: `marcus.vonhabsburg@email.com`
   - Password: `demo123`
3. Verify:
   - Profile loads correctly
   - Can view posts, events, announcements
   - Can interact with content

## Step 4: Admin Capabilities

As an admin (Eugene Akiwumi), you can:

### User Management
- View all members in the Friends tab
- See member statistics in admin profile
- Access invitation code generation

### Content Management
- Create posts (Events, Announcements, or Regular posts)
- Manage invitation codes
- View all events and announcements
- See all user interactions

### Invitation Codes
- Generate new invitation codes
- Set max uses and expiration dates
- Activate/deactivate codes
- Track usage statistics

## Important Notes

- All data is now loaded from Supabase (no local dummy data)
- Admin user must exist in Supabase Auth AND the users table
- Demo users need both Auth accounts and user profiles
- The app will automatically load admin from `akiwumi@gmail.com`
- Session persistence means users stay logged in across sessions

## Troubleshooting

### Admin profile doesn't load
- Verify admin user exists in Supabase Auth with email `akiwumi@gmail.com`
- Check that user profile exists in `users` table with `is_admin = true`
- Verify the UUID matches between Auth and users table

### Demo users can't login
- Ensure auth users are created for each demo user
- Verify user profiles exist in `users` table
- Check that UUIDs match between Auth and users table

### Data not loading
- Check Supabase connection in `.env` file
- Verify RLS policies allow read access
- Check browser console for errors

