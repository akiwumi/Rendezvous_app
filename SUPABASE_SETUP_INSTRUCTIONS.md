# Supabase Setup Instructions

This guide will help you set up and migrate your Supabase database for the Rendezvous Social Club app.

## Prerequisites

- Supabase project created at https://supabase.com
- Project URL: `https://qsqpoogatwwtydbrfans.supabase.co`
- Project ID: `qsqpoogatwwtydbrfans`

## Step 1: Run Initial Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `SUPABASE_SCHEMA.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify all tables were created successfully

## Step 2: Run Complete Migration

1. In the SQL Editor, create a **New Query**
2. Copy and paste the entire contents of `SUPABASE_MIGRATION_COMPLETE.sql`
3. Click **Run**
4. This will:
   - Add new post fields (headline, post_type, event_date, deadline, location, interested_users)
   - Ensure invitation codes are set up
   - Update RLS policies for post interactions
   - Create performance indexes
   - Verify all required columns exist

## Step 3: Create Admin User

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add User** (or **Invite User**)
3. Enter:
   - **Email**: `akiwumi@icloud.com`
   - **Password**: (set a secure password)
   - **Auto Confirm User**: ✅ (check this box)
4. Click **Create User**
5. **Copy the UUID** of the created user (you'll need this)

## Step 4: Seed Database with Test Data

1. Open `SUPABASE_SEED_DATA.sql`
2. **IMPORTANT**: Replace the admin UUID placeholder with the actual UUID from Step 3:
   - Find: `gen_random_uuid()` in the admin user INSERT
   - Replace with: `'YOUR_ADMIN_UUID_HERE'::uuid` (use the UUID you copied)
3. In SQL Editor, create a **New Query**
4. Copy and paste the updated `SUPABASE_SEED_DATA.sql`
5. Click **Run**
6. Verify data was inserted:
   - Check `users` table (should have 7 users)
   - Check `announcements` table (should have 5 announcements)
   - Check `events` table (should have 8 events)
   - Check `posts` table (should have 2 posts)

## Step 5: Configure Authentication

1. Go to **Authentication** > **Settings** in Supabase Dashboard
2. Under **Email Auth**:
   - ✅ Enable email confirmations (recommended for production)
   - For development, you can disable email confirmations
3. Under **Auth Providers**:
   - Ensure **Email** is enabled
4. Under **Email Templates**:
   - Customize confirmation email if desired

## Step 6: Verify RLS Policies

The migration script updates RLS policies, but verify they're correct:

1. Go to **Authentication** > **Policies** in Supabase Dashboard
2. Check that these policies exist for `posts` table:
   - "Anyone can read posts" (SELECT)
   - "Users can create posts" (INSERT)
   - "Users can interact with posts" (UPDATE) - for likes, comments, interested_users
   - "Users can delete own posts" (DELETE)

## Step 7: Test Registration

1. Start your app: `npm run dev`
2. Navigate to registration page
3. Fill out the form with:
   - Full Name
   - Email (use a test email)
   - Password (at least 6 characters)
   - Confirm Password
   - Phone Number
   - Invitation Code: `RENDEZVOUS2025`
4. Submit the form
5. Verify:
   - User is created in `auth.users`
   - User profile is created in `users` table
   - User is automatically logged in
   - Welcome notification is created

## Step 8: Test Post Creation (Admin)

1. Log in as admin (akiwumi@icloud.com)
2. Go to Admin Profile → Posts tab
3. Click "Create Post"
4. Test creating:
   - Regular post
   - Event post (with date, time, location, deadline)
   - Announcement post
5. Verify posts appear in the feed

## Troubleshooting

### Registration Fails
- Check that invitation code `RENDEZVOUS2025` exists in `invitation_codes` table
- Verify email confirmation is disabled (for testing) or check email for confirmation link
- Check browser console for error messages
- Verify RLS policies allow user creation

### Posts Not Saving
- Verify migration was run successfully
- Check that all new columns exist in `posts` table
- Verify RLS policies allow post creation and updates
- Check browser console for error messages

### Cannot Like/Comment on Posts
- Verify "Users can interact with posts" policy exists
- Check that the policy allows UPDATE operations
- Verify user is logged in

### Admin User Not Found
- Ensure admin user was created in `auth.users`
- Verify UUID matches in seed data
- Check that user profile exists in `users` table with `is_admin = true`

## Database Schema Overview

### Tables
- **users**: User profiles
- **posts**: Social media posts (with new fields for events/announcements)
- **events**: Club events
- **announcements**: Admin announcements
- **notifications**: User notifications
- **event_attendees**: Event RSVPs
- **friendships**: User friendships
- **invitation_codes**: Registration invitation codes

### Key Features
- Row Level Security (RLS) enabled on all tables
- Automatic timestamp updates (created_at, updated_at)
- UUID primary keys
- JSONB for flexible data (social_links, comments)

## Next Steps

After setup is complete:
1. Test all features (registration, login, posts, events)
2. Customize invitation codes as needed
3. Set up email templates for production
4. Configure storage buckets if you want to upload images to Supabase Storage
5. Set up real-time subscriptions if needed

## Support

If you encounter issues:
1. Check Supabase Dashboard logs
2. Review browser console errors
3. Verify all SQL scripts ran successfully
4. Check RLS policies are correctly configured

