# Supabase Storage Setup

Profile pictures, post images, and chat attachments are stored in Supabase Storage. Run the migration once to create the required buckets and RLS policies.

## Option 1: Supabase Dashboard (recommended)

1. Open your project at [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Open `supabase/migrations/20250310000000_storage_buckets.sql`
4. Copy and paste the full SQL into the editor
5. Click **Run**

## Option 2: Supabase CLI

```bash
supabase db push
```

(or `supabase migration up` if using linked project)

## Buckets created

- **avatars** – profile pictures (10MB max, public)
- **post-media** – post images/videos (200MB max, public)
- **chat-attachments** – chat files (50MB max, public)
