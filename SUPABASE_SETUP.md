# Supabase Integration Setup Guide

This guide will help you set up Supabase for the Rendezvous Social Club app.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project credentials

## Step 1: Create Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://qsqpoogatwwtydbrfans.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcXBvb2dhdHd3dHlkYnJmYW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzYxNzEsImV4cCI6MjA4MzM1MjE3MX0.2qfDw-pGDqEqFZUhub2g3MhWYjdrFgHDYkO-lithryA
```

**Note:** The `.env` file is already configured with the project credentials. If you need to use different credentials, update the values above.

## Step 2: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `SUPABASE_SCHEMA.sql`
4. Run the SQL script to create all necessary tables, indexes, and Row Level Security policies

The schema includes:
- `users` - User profiles and information
- `posts` - Social media posts
- `events` - Event listings
- `event_attendees` - Event registration tracking
- `notifications` - User notifications
- `announcements` - Admin announcements
- `friendships` - Friend relationships
- `invitation_codes` - Invitation code management

## Step 3: Configure Authentication

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Enable **Email** authentication
3. Configure email templates if needed
4. Set up email confirmation (optional but recommended)

## Step 4: Set Up Storage (Optional)

If you want to store user-uploaded images:

1. Go to **Storage** in Supabase Dashboard
2. Create a bucket named `avatars` for profile images
3. Create a bucket named `posts` for post images
4. Set up appropriate policies for public/private access

## Step 5: Test the Integration

1. Start the development server: `npm run dev`
2. Try registering a new user with invitation code `RENDEZVOUS2025`
3. Check your Supabase dashboard to verify data is being saved

## Features Integrated

### Authentication
- ✅ User registration with invitation code validation
- ✅ User login with email/password
- ✅ Session management
- ✅ Auto-login on app load

### Data Operations
- ✅ Posts creation and retrieval
- ✅ Events creation and registration
- ✅ Notifications management
- ✅ User profile management

### Fallback Support
- ✅ Falls back to local/dummy data if Supabase is unavailable
- ✅ Demo credentials still work for development
- ✅ Graceful error handling

## Current Configuration

- **Project URL:** https://qsqpoogatwwtydbrfans.supabase.co
- **Project ID:** qsqpoogatwwtydbrfans
- **API Key:** Configured in `.env` file

## Troubleshooting

### Authentication Issues
- Verify your Supabase URL and API key are correct
- Check that email authentication is enabled in Supabase
- Ensure the database schema has been created

### Data Not Saving
- Check browser console for errors
- Verify Row Level Security policies are set correctly
- Ensure you're authenticated before creating data

### Type Errors
- Run `npm run build` to check for TypeScript errors
- Ensure all dependencies are installed: `npm install`

## Next Steps

1. Set up email templates in Supabase for user registration
2. Configure storage buckets for image uploads
3. Set up real-time subscriptions for live updates
4. Add admin dashboard for managing users and content

