# Rendezvous App — Go-Live Guide

## Overview of what needs to happen

```
GitHub repo  →  Supabase (database + auth)  →  Vercel (hosting)
                     ↑
               Stripe (payments, later)
```

Right now the app stores everything in the browser's `localStorage` — that means data disappears per device. Supabase replaces that with a real shared database.

---

## PHASE 1 — Supabase Setup (Database & Auth)

### Step 1 — Create a Supabase account
1. Go to **supabase.com** and click "Start your project"
2. Sign in with GitHub (easiest)
3. Click **"New Project"**
4. Fill in:
   - **Name:** `rendezvous`
   - **Database Password:** generate a strong one and **save it somewhere safe**
   - **Region:** pick the one closest to your users (EU West for UK)
5. Click "Create new project" — takes about 2 minutes to provision

### Step 2 — Get your API keys
1. In your Supabase project, go to **Settings → API**
2. Copy these two values — you'll need them shortly:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3 — Create the database tables
1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Paste and run each block below one at a time by clicking **"Run"**

**Users table:**
```sql
create table public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  phone text,
  address text,
  bio text,
  profile_image text,
  is_admin boolean default false,
  friends text[] default '{}',
  liked_posts text[] default '{}',
  registered_events text[] default '{}',
  created_at timestamptz default now()
);
```

**Posts table:**
```sql
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete cascade,
  author_name text not null,
  author_image text,
  headline text,
  content text not null,
  image text,
  link text,
  post_type text check (post_type in ('event','announcement','regular')) default 'regular',
  event_date timestamptz,
  deadline timestamptz,
  location text,
  interested_users text[] default '{}',
  is_paid boolean default false,
  ticket_price integer,
  ticket_currency text default 'GBP',
  payment_type text default 'free',
  likes text[] default '{}',
  created_at timestamptz default now()
);
```

**Comments table:**
```sql
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references public.users(id) on delete cascade,
  author_name text not null,
  author_image text,
  content text not null,
  created_at timestamptz default now()
);
```

**Events table:**
```sql
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image text,
  date timestamptz not null,
  location text,
  attendees text[] default '{}',
  max_attendees integer,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);
```

**Announcements table:**
```sql
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image text,
  link text,
  date timestamptz default now(),
  type text default 'other',
  created_at timestamptz default now()
);
```

**Advertisements table:**
```sql
create table public.advertisements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  advertiser_name text not null,
  advertiser_url text not null,
  media_type text check (media_type in ('image','video')) default 'image',
  media_url text not null,
  thumbnail_url text,
  allow_fullscreen boolean default false,
  start_date timestamptz not null,
  end_date timestamptz not null,
  frequency integer default 3,
  is_active boolean default true,
  impressions integer default 0,
  clicks integer default 0,
  payment_status text default 'pending',
  payment_amount integer default 0,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);
```

**Admin messages table:**
```sql
create table public.admin_messages (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.users(id),
  user_id uuid references public.users(id),
  sender_id uuid references public.users(id),
  sender_name text not null,
  content text not null,
  timestamp timestamptz default now(),
  read boolean default false
);
```

**Invitation codes table:**
```sql
create table public.invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  max_uses integer default 1,
  used_count integer default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);
```

### Step 4 — Set up Row Level Security (RLS)
This controls who can read/write what. Run this in SQL Editor:

```sql
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.events enable row level security;
alter table public.announcements enable row level security;
alter table public.advertisements enable row level security;
alter table public.admin_messages enable row level security;
alter table public.invitation_codes enable row level security;

-- Allow anyone to read public content
create policy "Public read" on public.posts for select using (true);
create policy "Public read" on public.comments for select using (true);
create policy "Public read" on public.events for select using (true);
create policy "Public read" on public.announcements for select using (true);
create policy "Public read" on public.advertisements for select using (true);
create policy "Public read" on public.users for select using (true);
create policy "Public read" on public.invitation_codes for select using (true);

-- Allow anyone to insert/update (your app handles auth logic)
create policy "App write" on public.posts for all using (true);
create policy "App write" on public.comments for all using (true);
create policy "App write" on public.events for all using (true);
create policy "App write" on public.announcements for all using (true);
create policy "App write" on public.advertisements for all using (true);
create policy "App write" on public.users for all using (true);
create policy "App write" on public.admin_messages for all using (true);
create policy "App write" on public.invitation_codes for all using (true);
```

> **Note:** These are open policies for now. Once the app is stable you can tighten these so users can only edit their own data.

### Step 5 — Seed your admin user
In SQL Editor, add yourself as the first admin:
```sql
insert into public.users (id, full_name, email, is_admin, created_at)
values (
  gen_random_uuid(),
  'Eugene Akiwumi',
  'akiwumi@gmail.com',
  true,
  now()
);
```

---

## PHASE 2 — Wire the App to Supabase

### Step 6 — Create the environment file
In the root of the project (same folder as `package.json`), create a file called `.env`:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJyour-anon-key-here
```

Replace the values with what you copied in Step 2.

Then create `.env.example` (safe to commit to GitHub — no real keys):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add `.env` to `.gitignore` so your keys never get pushed to GitHub:
```
# in .gitignore — add this line if not already there
.env
```

### Step 7 — Create the Supabase client file
Create a new file at `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 8 — Replace localDataService with Supabase calls
This is the main coding work. Each service function (e.g. `postService.getPosts()`) needs to be rewritten to query Supabase instead of localStorage. Example:

**Before (localStorage):**
```typescript
getPosts: () => {
  return Promise.resolve(data.posts);
}
```

**After (Supabase):**
```typescript
getPosts: async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
```

> Ask Claude to rewrite the entire `localDataService.ts` to use Supabase once your tables are created.

---

## PHASE 3 — Deploy to Vercel

### Step 9 — Push your code to GitHub
```bash
git add .
git commit -m "Prepare for production"
git push origin main
```

### Step 10 — Create a Vercel account and deploy
1. Go to **vercel.com** and sign in with GitHub
2. Click **"Add New Project"**
3. Find your `Rendezvous_app` repository and click **Import**
4. Vercel auto-detects it as a Vite project — leave all settings as-is
5. Before clicking Deploy, click **"Environment Variables"** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
6. Click **Deploy**

Vercel gives you a live URL like `rendezvous-app.vercel.app` immediately.

Every time you `git push` to `main`, Vercel automatically redeploys.

### Step 11 — Set up a custom domain (optional)
1. In Vercel, go to your project → **Settings → Domains**
2. Add your domain (e.g. `rendezvousclub.com`)
3. Vercel shows you DNS records to add at your domain registrar (GoDaddy, Namecheap, etc.)
4. Add those records — live within minutes to 48 hours depending on registrar

---

## PHASE 4 — After Launch

### Step 12 — Set up Stripe (paid events)
1. Create account at **stripe.com**
2. Get your **Publishable Key** and **Secret Key** from the Stripe Dashboard
3. Add `VITE_STRIPE_PUBLISHABLE_KEY` to Vercel environment variables
4. The ticket pricing fields are already in the database — just need the payment flow wired up
5. Ask Claude to build the Stripe checkout flow when ready

### Step 13 — Set up image storage
Currently images are stored as base64 strings (very large). For production:
1. In Supabase, go to **Storage → New bucket**
2. Create buckets: `avatars`, `post-images`, `ad-media`
3. Make them public
4. Ask Claude to update the image upload code to use Supabase Storage

### Step 14 — Set up email (invitation codes)
Supabase has built-in email via **Auth → Email Templates**. For custom emails (sending invite codes), use **Resend** (resend.com) — free tier sends 3,000 emails/month.

---

## Quick Reference — What does what

| Service | Purpose | Free tier |
|---|---|---|
| **Supabase** | Database, auth, storage | 500MB DB, 1GB storage |
| **Vercel** | Hosting, auto-deploys | Unlimited deploys |
| **Stripe** | Payments | 1.4% + 20p per transaction |
| **Resend** | Transactional email | 3,000/month |

---

## Recommended order

1. **Phase 1** — Create Supabase tables (~1 hour)
2. **Ask Claude** to rewrite `localDataService.ts` for Supabase — Claude does the code
3. **Test locally** with your `.env` file — `npm run dev`
4. **Phase 3** — Deploy to Vercel (~20 minutes)
5. Add **Stripe** when ready for paid events
6. Add **Supabase Storage** to replace base64 images
