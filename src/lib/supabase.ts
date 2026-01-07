import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qsqpoogatwwtydbrfans.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcXBvb2dhdHd3dHlkYnJmYW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NzYxNzEsImV4cCI6MjA4MzM1MjE3MX0.2qfDw-pGDqEqFZUhub2g3MhWYjdrFgHDYkO-lithryA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const TABLES = {
  users: 'users',
  posts: 'posts',
  events: 'events',
  notifications: 'notifications',
  announcements: 'announcements',
  friendships: 'friendships',
  event_attendees: 'event_attendees',
  invitation_codes: 'invitation_codes',
} as const;

