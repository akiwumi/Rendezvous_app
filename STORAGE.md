# Supabase Storage Setup Guide

The app uploads images, videos, and documents directly to Supabase Storage. You need to create three storage buckets and make them publicly readable. This takes about 10 minutes.

---

## What gets stored where

| Bucket | Used for | Size limit |
|---|---|---|
| `avatars` | User profile photos | 10 MB |
| `post-media` | Images, videos, and documents on posts | 200 MB (video), 25 MB (other) |
| `chat-attachments` | Images, videos, and documents sent in chat | 50 MB |

---

## Step 1 — Create the storage buckets

1. Go to your Supabase project dashboard
2. Click **Storage** in the left sidebar
3. Click **New bucket** and create each of the following:

**Bucket 1:**
- Name: `avatars`
- Toggle **Public bucket** ON
- Click **Save**

**Bucket 2:**
- Name: `post-media`
- Toggle **Public bucket** ON
- Click **Save**

**Bucket 3:**
- Name: `chat-attachments`
- Toggle **Public bucket** ON
- Click **Save**

> **Why public?** The app displays these files directly in `<img>` and `<video>` tags using the public URL. If the bucket is private, the files won't load.

---

## Step 2 — Set storage policies

By default, even a public bucket requires a policy to allow uploads. Run the following SQL in **SQL Editor → New query**:

```sql
-- Allow any authenticated user to upload to all three buckets
create policy "Authenticated uploads — avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "Authenticated uploads — post-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-media');

create policy "Authenticated uploads — chat-attachments"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'chat-attachments');

-- Allow users to overwrite their own avatar
create policy "Users can update own avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow public read on all three buckets
create policy "Public read — avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "Public read — post-media"
  on storage.objects for select
  to public
  using (bucket_id = 'post-media');

create policy "Public read — chat-attachments"
  on storage.objects for select
  to public
  using (bucket_id = 'chat-attachments');
```

Click **Run**. You should see "Success. No rows returned."

---

## Step 3 — Verify it works

1. Run the app locally (`npm run dev`) with your `.env` keys set
2. Go to your profile page and tap the camera icon — upload a photo
3. Your profile picture should update immediately (no page reload needed)
4. Go to Create Post (admin only) and upload an image or video — it should appear in the preview
5. Go to Chat and tap the 📎 paperclip button — send an image or document

If any of those fail, check **Storage → Logs** in the Supabase dashboard for the specific error.

---

## Step 4 — Set file size limits (optional)

Supabase Free tier has a 50 MB per-file limit by default. The app enforces its own limits before uploading (10 MB for avatars, 200 MB for videos, 25 MB for other files), but you can also enforce limits at the bucket level:

1. In Supabase → Storage → click on the bucket name
2. Click **Edit bucket**
3. Set **File size limit** to whatever you want (e.g. `209715200` for 200 MB)
4. Click **Save**

> **Note:** On the Supabase free tier, total storage is capped at 1 GB across all buckets. Upgrade to Pro for more.

---

## Step 5 — Set up CORS for your Vercel domain (if needed)

If uploads work locally but fail on Vercel, you may need to allow your production domain:

1. In Supabase → **Storage → Policies**
2. Confirm the policies you created in Step 2 are listed
3. In Supabase → **Project Settings → API**
4. Under **CORS**, add your Vercel URL: `https://your-app.vercel.app`

In most cases CORS is not needed because Supabase Storage allows all origins by default.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Upload fails with "Bucket not found" | You didn't create the bucket in Step 1. Check the bucket name matches exactly (`avatars`, `post-media`, `chat-attachments`). |
| Upload fails with "row-level security policy" | You didn't run the SQL in Step 2, or you ran it while not logged in. Make sure the user is authenticated before uploading. |
| Image uploads but doesn't display | The bucket is not set to Public. Go to Storage → edit the bucket → toggle Public ON. |
| "File too large" error in the app | The file exceeds the app's client-side limit (10 MB avatars, 200 MB video, 25 MB other, 50 MB chat). |
| Supabase free tier storage full | You've used 1 GB. Delete old uploads in Storage → browse files, or upgrade to Supabase Pro. |

---

## What was built in the app

| File | What changed |
|---|---|
| `src/services/localDataService.ts` | Added `storageService` — `uploadAvatar`, `uploadPostMedia`, `uploadChatAttachment`, `getAttachmentType`, `isVideoUrl` |
| `src/pages/ProfilePage.tsx` | Profile image upload now sends to `avatars` bucket instead of storing base64 |
| `src/pages/CreatePostPage.tsx` | Post media upload sends to `post-media` bucket; supports images, videos (up to 200 MB), and documents (PDF, Word, Excel, PowerPoint) |
| `src/pages/ChatPage.tsx` | Paperclip button uploads to `chat-attachments`; images/videos render inline, documents show as download link |
| `src/types/index.ts` | `Message` type extended with `attachmentUrl`, `attachmentName`, `attachmentType` fields |
