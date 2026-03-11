-- Create storage buckets for avatars, post media, and chat attachments
-- Run this migration in Supabase Dashboard > SQL Editor, or via: supabase db push

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('avatars', 'avatars', true, 26214400),
  ('post-media', 'post-media', true, 209715200),
  ('chat-attachments', 'chat-attachments', true, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if re-running (idempotent)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload post media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update post media" ON storage.objects;
DROP POLICY IF EXISTS "Post media is publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update chat attachments" ON storage.objects;
DROP POLICY IF EXISTS "Chat attachments are publicly readable" ON storage.objects;

-- RLS policies for avatars bucket
-- Allow authenticated users to upload to their own folder: avatars/{user_id}/
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow upsert (update existing avatar)
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow select for public read (avatars bucket is public)
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- RLS policies for post-media bucket
CREATE POLICY "Users can upload post media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'post-media');

CREATE POLICY "Users can update post media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'post-media');

CREATE POLICY "Post media is publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'post-media');

-- RLS policies for chat-attachments bucket
CREATE POLICY "Users can upload chat attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

CREATE POLICY "Users can update chat attachments"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'chat-attachments');

CREATE POLICY "Chat attachments are publicly readable"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'chat-attachments');
