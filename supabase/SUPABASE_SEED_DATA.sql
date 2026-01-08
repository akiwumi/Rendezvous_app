-- Rendezvous Social Club - Seed Data
-- Run this SQL in your Supabase SQL Editor after running SUPABASE_SCHEMA.sql
-- This will populate the database with test data

-- First, create the admin user in auth.users (you'll need to do this manually or via Supabase Auth)
-- For now, we'll insert the admin user profile with a UUID
-- Note: You'll need to create the auth user first, then update the id here

-- Insert Admin User (Pernilla Ewarldsson)
-- IMPORTANT: First create the admin user in Supabase Auth, then use that UUID here
-- Admin UUID: d8750992-cb10-485d-8d45-2746af3db391
INSERT INTO users (id, email, full_name, phone, address, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'd8750992-cb10-485d-8d45-2746af3db391'::uuid,
  'akiwumi@icloud.com',
  'Pernilla Ewarldsson',
  '+34 971 123 456',
  'Palma de Mallorca, Spain',
  '/pernilla.png',
  '{"instagram": "@pernilla_rendezvous", "facebook": "pernilla.ewarldsson", "twitter": "@PernillaRSC", "linkedin": "pernilla-ewarldsson"}'::jsonb,
  true,
  ARRAY['user-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']::text[],
  ARRAY['post-1', 'post-2']::text[],
  ARRAY['evt-1', 'evt-2', 'evt-3', 'evt-4', 'evt-5', 'evt-6', 'evt-7', 'evt-8']::text[]
) ON CONFLICT (id) DO NOTHING;

-- Insert Dummy Users
-- Note: These users won't have auth accounts, they're just profile data
-- In production, you'd create auth users first, then insert profiles with matching UUIDs
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, friends, liked_posts, registered_events)
VALUES 
  (
    gen_random_uuid(),
    'marcus.vonhabsburg@email.com',
    'Marcus von Habsburg',
    '+34 971 234 567',
    'Palma de Mallorca, Spain',
    'Investment banker and wine connoisseur, Marcus relocated to Mallorca from Vienna five years ago. Passionate about fine wines, classical music, and sailing the Mediterranean. Member of Rendezvous since 2020, where I''ve discovered some of the best vintages and made lifelong friendships. Always up for a game of golf or a wine tasting evening.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    '{"instagram": "@marcus_vh", "linkedin": "marcus-von-habsburg"}'::jsonb,
    ARRAY['admin-1', 'user-2', 'user-3', 'user-4']::text[],
    ARRAY['post-1']::text[],
    ARRAY['evt-1', 'evt-3', 'evt-5']::text[]
  ),
  (
    gen_random_uuid(),
    'isabella.rossi@email.com',
    'Isabella Rossi',
    '+34 971 345 678',
    'Valldemossa, Mallorca',
    'Italian fashion designer and art enthusiast. Moved to Mallorca three years ago to open my boutique in the heart of Valldemossa. Love attending art exhibitions, jazz nights, and yacht trips. The Rendezvous community has been incredibly welcoming, and I''ve met some of the most inspiring people here. Passionate about sustainable fashion and Mediterranean lifestyle.',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    '{"instagram": "@isabella_rossi", "facebook": "isabella.rossi", "twitter": "@IsabellaR"}'::jsonb,
    ARRAY['admin-1', 'user-1', 'user-3', 'user-5', 'user-6']::text[],
    ARRAY['post-1', 'post-2']::text[],
    ARRAY['evt-2', 'evt-4', 'evt-6']::text[]
  ),
  (
    gen_random_uuid(),
    'james.chen@email.com',
    'James Chen',
    '+34 971 456 789',
    'Deià, Mallorca',
    'Tech entrepreneur and photography enthusiast from San Francisco. Relocated to Deià six years ago for a slower pace of life while running my software company remotely. Love capturing the stunning Mallorcan landscapes through my lens and sharing moments with the Rendezvous community. Passionate about technology, photography, and Mediterranean cuisine. Always keen on photography workshops and wine tastings.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    '{"instagram": "@jameschen", "linkedin": "james-chen", "twitter": "@JamesChen"}'::jsonb,
    ARRAY['admin-1', 'user-1', 'user-2', 'user-4']::text[],
    ARRAY['post-2']::text[],
    ARRAY['evt-1', 'evt-7', 'evt-8']::text[]
  ),
  (
    gen_random_uuid(),
    'sophie.laurent@email.com',
    'Sophie Laurent',
    '+34 971 567 890',
    'Port de Sóller, Mallorca',
    'French chef and culinary instructor. Moved to Port de Sóller four years ago to open my cooking school and explore the rich Mallorcan gastronomy. Absolutely love the cooking masterclasses at Rendezvous - they''re a perfect blend of learning and socializing. Passionate about authentic Mediterranean cuisine, local ingredients, and sharing culinary traditions. When I''m not cooking, you''ll find me at yacht trips or beach BBQs.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    '{"instagram": "@sophie_laurent", "facebook": "sophie.laurent", "linkedin": "sophie-laurent"}'::jsonb,
    ARRAY['admin-1', 'user-1', 'user-3', 'user-5']::text[],
    ARRAY['post-1', 'post-2']::text[],
    ARRAY['evt-2', 'evt-3', 'evt-4', 'evt-5']::text[]
  ),
  (
    gen_random_uuid(),
    'thomas.mueller@email.com',
    'Thomas Müller',
    '+34 971 678 901',
    'Alcúdia, Mallorca',
    'German real estate developer who fell in love with Mallorca''s architecture and lifestyle. Moved here two years ago from Munich. Love the relaxed beach atmosphere and the exclusive events at Rendezvous. Passionate about sailing, golf, and enjoying the Mediterranean sunsets. The sunset beach BBQs are my favorite events - perfect for unwinding and connecting with great people.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    '{"instagram": "@thomas_mueller", "linkedin": "thomas-mueller"}'::jsonb,
    ARRAY['admin-1', 'user-2', 'user-4', 'user-6']::text[],
    ARRAY[]::text[],
    ARRAY['evt-6', 'evt-8']::text[]
  ),
  (
    gen_random_uuid(),
    'maria.santos@email.com',
    'Maria Santos',
    '+34 971 789 012',
    'Calvià, Mallorca',
    'Spanish marketing executive and cultural event organizer. Born in Madrid, moved to Calvià three years ago for the vibrant social scene. Love the exclusive art exhibitions and jazz nights at Rendezvous - they remind me why I chose this island. Passionate about contemporary art, live music, and connecting people. The photography workshops are amazing for capturing Mallorca''s beauty. Always up for networking and making new connections!',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    '{"instagram": "@maria_santos", "facebook": "maria.santos", "twitter": "@MariaSantos", "linkedin": "maria-santos"}'::jsonb,
    ARRAY['admin-1', 'user-2', 'user-5']::text[],
    ARRAY['post-1']::text[],
    ARRAY['evt-1', 'evt-4', 'evt-7']::text[]
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Announcements
-- Note: Replace 'admin-1' with the actual admin UUID from above
INSERT INTO announcements (id, title, content, image, link, date, type, created_by)
VALUES 
  (
    gen_random_uuid(),
    'Exclusive Summer Party',
    'Join us for an unforgettable summer soirée at our private beach club. Enjoy live music, premium cocktails, and gourmet cuisine under the stars. Dress code: Elegant summer attire. RSVP required.',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://rendezvous.club/events/summer-party',
    '2025-07-15T20:00:00'::timestamp with time zone,
    'party',
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Pizza Night at Villa Rendezvous',
    'Authentic Italian pizza night featuring wood-fired pizzas from our guest chef. Limited to 30 members. First come, first served. Wine pairing included.',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    'https://rendezvous.club/events/pizza-night',
    '2025-06-28T19:00:00'::timestamp with time zone,
    'event',
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Contemporary Art Exhibition',
    'Opening reception for our curated art exhibition featuring local and international artists. Private viewing for members only. Light refreshments served.',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    'https://rendezvous.club/events/art-exhibition',
    '2025-07-05T18:00:00'::timestamp with time zone,
    'exhibition',
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Paddle Tennis Tournament',
    'Annual member paddle tennis tournament. Singles and doubles categories. Trophy presentation and celebratory dinner following the finals. Register by June 20th.',
    '/paddle.jpg',
    'https://rendezvous.club/events/paddle-tournament',
    '2025-07-10T09:00:00'::timestamp with time zone,
    'tournament',
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Safari Adventure to Kenya',
    'Exclusive 7-day safari trip to the Maasai Mara. Experience the great migration, luxury tented camps, and world-class game viewing. Limited to 12 members. Early booking recommended.',
    '/safari.jpg',
    'https://rendezvous.club/events/kenya-safari',
    '2025-08-20T00:00:00'::timestamp with time zone,
    'trip',
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Events
INSERT INTO events (id, title, description, image, date, location, max_attendees, created_by)
VALUES 
  (
    gen_random_uuid(),
    'Wine Tasting Evening',
    'Join us for an exclusive wine tasting featuring rare vintages from renowned vineyards. Expert sommelier will guide us through the tasting notes.',
    'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    '2025-06-25T19:00:00'::timestamp with time zone,
    'Club Lounge',
    25,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Yacht Day Trip',
    'Spend the day cruising the Mediterranean on our private yacht. Swimming, snorkeling, and gourmet lunch included.',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    '2025-07-02T10:00:00'::timestamp with time zone,
    'Port de Palma',
    20,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Cooking Masterclass',
    'Learn to prepare authentic Mallorcan cuisine with our guest chef. Hands-on cooking experience followed by dinner.',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    '2025-07-08T17:00:00'::timestamp with time zone,
    'Club Kitchen',
    15,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Jazz Night',
    'Live jazz performance by international artists. Cocktails and canapés served throughout the evening.',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    '2025-07-12T20:00:00'::timestamp with time zone,
    'Main Hall',
    50,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Golf Tournament',
    'Annual member golf tournament at the championship course. Prizes for winners and closest to pin.',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800',
    '2025-07-18T08:00:00'::timestamp with time zone,
    'Golf Club',
    40,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Sunset Beach BBQ',
    'Relaxed evening on the beach with grilled specialties, live music, and bonfire. Family-friendly event.',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    '2025-07-22T19:00:00'::timestamp with time zone,
    'Private Beach',
    60,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Photography Workshop',
    'Learn landscape and portrait photography techniques with a professional photographer. Equipment provided.',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
    '2025-07-28T14:00:00'::timestamp with time zone,
    'Club Gardens',
    12,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  ),
  (
    gen_random_uuid(),
    'Gala Dinner',
    'Formal gala dinner celebrating the club''s anniversary. Black tie required. Live orchestra and dancing.',
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    '2025-08-05T19:30:00'::timestamp with time zone,
    'Grand Ballroom',
    100,
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1)
  )
ON CONFLICT (id) DO NOTHING;

-- Insert Posts
INSERT INTO posts (id, author_id, author_name, author_image, content, image, created_at)
VALUES 
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1),
    'Pernilla Ewarldsson',
    '/pernilla.png',
    'Welcome to Rendezvous Social Club! We''re thrilled to have you as part of our exclusive community. Looking forward to creating wonderful memories together.',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
    '2025-06-01T10:00:00'::timestamp with time zone
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'akiwumi@icloud.com' LIMIT 1),
    'Pernilla Ewarldsson',
    '/pernilla.png',
    'Just returned from an amazing weekend at the club. The new facilities are absolutely stunning! Can''t wait to see everyone at the upcoming events.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    '2025-06-05T15:30:00'::timestamp with time zone
  )
ON CONFLICT (id) DO NOTHING;

-- IMPORTANT NOTES:
-- 1. Before running this script, create the admin user in Supabase Auth:
--    - Go to Authentication > Users > Add User
--    - Email: pernilla@rendezvous.club
--    - Set a password
--    - Copy the UUID from the created user
--    - Replace the gen_random_uuid() in the admin user INSERT with that UUID
--
-- 2. The friends arrays reference user IDs. After inserting users, you may need to:
--    - Query the users table to get actual UUIDs
--    - Update the friends arrays in the users table
--
-- 3. Similarly, liked_posts and registered_events arrays reference post/event IDs
--    - After inserting posts/events, update these arrays with actual UUIDs
--
-- 4. For production, consider creating a migration script that:
--    - Creates auth users first
--    - Inserts profiles with matching UUIDs
--    - Updates friend/post/event references

