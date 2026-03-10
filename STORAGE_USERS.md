# Supabase & Users Setup Guide for Rendezvous

This guide walks you through all the steps needed in Supabase to make the app work (storage, users, admins, etc.). No coding experience required—just follow the steps in order.

---

## Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Your project created with **URL** and **Anon Key** available
- Access to your project folder

---

## Step 1: Storage (profile photos & cover images)

### 1.1 Open the SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Left sidebar → **SQL Editor**
4. Click **+ New query**

### 1.2 Run the storage migration

1. Open `supabase/migrations/20250310000000_storage_buckets.sql` in your project
2. Copy **all** of its contents (Ctrl+A, Ctrl+C)
3. Paste into the SQL Editor
4. Click **Run**
5. You should see "Success" or "No rows returned"

### 1.3 Add cover image column (profile header)

1. Click **+ New query** again
2. Open `supabase/migrations/20250310120000_add_cover_image.sql`
3. Copy all, paste, **Run**

**Result:** Storage buckets (avatars, post-media, chat-attachments) and cover_image column on users.

---

## Step 2: Database policies (admins can promote users)

This step lets admins promote other users to admin from within the app (Admin Console → Users → Make admin).

### 2.1 Run the RLS migration

1. In SQL Editor, click **+ New query**
2. Open `supabase/migrations/20250310130000_admin_promote_rls.sql`
3. Copy all, paste, **Run**

**Result:** Admins can update the `is_admin` field on other users.

---

## Step 3: Create your first admin (one-time only)

Before the app can promote admins, **you need at least one admin** in the database. Do this once.

### Option A: Table Editor

1. Left sidebar → **Table Editor**
2. Open the **users** table
3. Find the row with your email
4. Click the **is_admin** cell → change to `true`
5. Press Enter to save

### Option B: SQL

1. SQL Editor → **+ New query**
2. Replace `your-email@example.com` with your email and run:

```sql
UPDATE users
SET is_admin = true
WHERE email = 'your-email@example.com';
```

3. Click **Run**

**After this:** You can promote more admins from **Admin Console** in the app (no Supabase needed).

---

## Step 4: Environment variables (.env)

Your app needs Supabase credentials.

### 4.1 Get your keys

1. Supabase Dashboard → your project
2. **Project Settings** (gear icon) → **API**
3. Copy **Project URL** and **anon public** key

### 4.2 Create or edit `.env`

In the project folder, create or edit `.env`:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your actual values.

**Important:** Do not commit `.env` to Git. It’s in `.gitignore`.

---

## Promoting admins from within the app

Once Step 2 and Step 3 are done:

1. Log in as an admin
2. Go to **Admin Console** (from Admin Profile or nav)
3. Click the **Users** section
4. Find the user you want to promote
5. Click **Make admin**

To remove admin access (except from yourself):

6. Find the admin user
7. Click **Remove admin**

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| "Failed to upload profile image" | Run Step 1 (storage migration). Confirm you’re logged in. |
| "Admin user not found" | Run Step 3 to set your user as admin. Log out and back in. |
| "Failed to promote user" | Run Step 2 (RLS migration). |
| 404 on page refresh (deployed) | Check `vercel.json` is deployed. In Vercel, set Output Directory to `dist`. |
| Storage buckets already exist | Safe to rerun; migration uses `ON CONFLICT DO NOTHING`. |

---

## Full Supabase checklist (in order)

- [ ] **Step 1.2** – Run storage buckets migration (`20250310000000_storage_buckets.sql`)
- [ ] **Step 1.3** – Run cover image migration (`20250310120000_add_cover_image.sql`)
- [ ] **Step 2.1** – Run admin promote RLS migration (`20250310130000_admin_promote_rls.sql`)
- [ ] **Step 3** – Set `is_admin = true` for your user (Table Editor or SQL)
- [ ] **Step 4** – Ensure `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Restart dev server after editing `.env` (`npm run dev`)
