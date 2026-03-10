# Supabase Setup Guide for Rendezvous

This guide walks you through the steps needed in Supabase to make the app work correctly (profile photos, admin features, etc.). No coding experience required—just follow the steps.

---

## Prerequisites

- You have a Supabase account (free at [supabase.com](https://supabase.com))
- Your project is already created and you have the **URL** and **Anon Key** in your `.env` file

---

## Step 1: Enable Storage (for profile pictures and uploads)

Profile photos and post images are stored in Supabase Storage. You need to create buckets and set up access rules.

### 1.1 Open the SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on your project (e.g. "Rendezvous_app")
3. In the left sidebar, click **SQL Editor**
4. Click **+ New query**

### 1.2 Run the storage migration

1. Open the file `supabase/migrations/20250310000000_storage_buckets.sql` in your project folder
2. Copy **all** of its contents (Ctrl+A, then Ctrl+C)
3. Paste into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" or similar—that's correct

### 1.3 Add cover image column (for profile header)

1. Open the file `supabase/migrations/20250310120000_add_cover_image.sql`
2. Copy all of its contents
3. In SQL Editor, **+ New query**, paste, and **Run**

### 1.4 What you created

- **avatars** – profile pictures and profile header images (max 10 MB each)
- **post-media** – images/videos in posts (max 200 MB)
- **chat-attachments** – files in chat (max 50 MB)

**No separate storage bucket for the header** – cover images use the same `avatars` bucket.

---

## Step 2: Make yourself an admin (if you’re not already)

The admin profile and Admin Console only work for users marked as admins. This must be set in the database.

### 2.1 Open the Table Editor

1. In the Supabase left sidebar, click **Table Editor**
2. Click the **users** table

### 2.2 Set admin flag for your user

1. Find the row where your email appears
2. Click on the **is_admin** cell for that row
3. Change `false` to `true` (or use the toggle if available)
4. Press Enter or click outside the cell to save

**Alternative: use SQL**

1. Go to **SQL Editor** → **+ New query**
2. Replace `your-email@example.com` with your real email and run:

```sql
UPDATE users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

3. Click **Run**

---

## Step 3: Check environment variables (local development)

Your app needs Supabase credentials to connect. They live in a `.env` file in the project root.

### 3.1 Confirm your `.env` file

Create or edit `.env` in the project folder with:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with:

- **VITE_SUPABASE_URL**: Project URL from **Project Settings** → **API** → **Project URL**
- **VITE_SUPABASE_ANON_KEY**: Anon public key from **Project Settings** → **API** → **Project API keys** → **anon public**

**Important:** Do not commit `.env` to Git. It is already in `.gitignore`.

---

## Step 4: Edit your profile (admin or regular user)

### Profile page (where you edit)

1. Log in to the app
2. Go to **Profile** (tap the Profile tab or your avatar)
3. Click **Edit profile**
4. Change your name, bio, phone, address, and social links
5. Click **Save**

### Profile photo

1. On your profile page, click your avatar or the **Upload photo** / **Change photo** button
2. Choose an image from your device (JPEG, PNG, GIF, or WebP)
3. Wait for the upload to finish

### Admin profile

1. Admins can open **Profile** in the nav or the **Admin Profile** page
2. Click **Edit Profile** to go to the editable profile
3. Use the same flow as above to edit bio, photo, etc.

---

## Troubleshooting

### "Failed to upload profile image"

- Ensure **Step 1** was completed successfully
- Confirm you are logged in when trying to upload
- Try again; sometimes the first upload after setup is slower

### "Admin user not found"

- Complete **Step 2** to set `is_admin = true` for your user
- Log out and log back in so the app picks up the change

### 404 on page refresh (deployed app)

- This is usually fixed by `vercel.json`. Ensure it is deployed
- In Vercel, check **Settings** → **General** → **Output Directory** is set to `dist`

### Storage buckets already exist

- If you rerun the migration, it’s safe. The SQL uses `ON CONFLICT DO NOTHING` and drops/recreates policies
- You can run it again without breaking existing data

---

## Quick checklist

- [ ] Ran storage buckets migration in SQL Editor (Step 1.2)
- [ ] Ran cover image column migration (Step 1.3)
- [ ] Set `is_admin = true` for your user (Step 2)
- [ ] `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Step 3)
- [ ] Restarted dev server after changing `.env` (`npm run dev`)
