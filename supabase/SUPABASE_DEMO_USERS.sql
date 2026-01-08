-- Create 6 Demo Users in Supabase
-- IMPORTANT: First create these users in Supabase Auth Dashboard, then run this script with their UUIDs
-- 
-- Instructions:
-- 1. Go to Supabase Dashboard > Authentication > Users > Add User
-- 2. Create each user with their email and password (all passwords are: demo123)
-- 3. Copy each UUID and replace the placeholders below
-- 4. Run this SQL script

-- Demo User 1: Marcus von Habsburg
-- Email: marcus.vonhabsburg@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_1_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'marcus.vonhabsburg@email.com',
  'Marcus von Habsburg',
  '+34 971 234 567',
  'Palma de Mallorca, Spain',
  'Investment banker and wine connoisseur, Marcus relocated to Mallorca from Vienna five years ago. Passionate about fine wines, classical music, and sailing the Mediterranean. Member of Rendezvous since 2020, where I''ve discovered some of the best vintages and made lifelong friendships. Always up for a game of golf or a wine tasting evening.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  '{"instagram": "@marcus_vh", "linkedin": "marcus-von-habsburg"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Demo User 2: Isabella Rossi
-- Email: isabella.rossi@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_2_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'isabella.rossi@email.com',
  'Isabella Rossi',
  '+34 971 345 678',
  'Valldemossa, Mallorca',
  'Italian fashion designer and art enthusiast. Moved to Mallorca three years ago to open my boutique in the heart of Valldemossa. Love attending art exhibitions, jazz nights, and yacht trips. The Rendezvous community has been incredibly welcoming, and I''ve met some of the most inspiring people here. Passionate about sustainable fashion and Mediterranean lifestyle.',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  '{"instagram": "@isabella_rossi", "facebook": "isabella.rossi", "twitter": "@IsabellaR"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Demo User 3: James Chen
-- Email: james.chen@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_3_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'james.chen@email.com',
  'James Chen',
  '+34 971 456 789',
  'Deià, Mallorca',
  'Tech entrepreneur and photography enthusiast from San Francisco. Relocated to Deià six years ago for a slower pace of life while running my software company remotely. Love capturing the stunning Mallorcan landscapes through my lens and sharing moments with the Rendezvous community. Passionate about technology, photography, and Mediterranean cuisine. Always keen on photography workshops and wine tastings.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  '{"instagram": "@jameschen", "linkedin": "james-chen", "twitter": "@JamesChen"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Demo User 4: Sophie Laurent
-- Email: sophie.laurent@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_4_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'sophie.laurent@email.com',
  'Sophie Laurent',
  '+34 971 567 890',
  'Port de Sóller, Mallorca',
  'French chef and culinary instructor. Moved to Port de Sóller four years ago to open my cooking school and explore the rich Mallorcan gastronomy. Absolutely love the cooking masterclasses at Rendezvous - they''re a perfect blend of learning and socializing. Passionate about authentic Mediterranean cuisine, local ingredients, and sharing culinary traditions. When I''m not cooking, you''ll find me at yacht trips or beach BBQs.',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  '{"instagram": "@sophie_laurent", "facebook": "sophie.laurent", "linkedin": "sophie-laurent"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Demo User 5: Thomas Müller
-- Email: thomas.mueller@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_5_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'thomas.mueller@email.com',
  'Thomas Müller',
  '+34 971 678 901',
  'Alcúdia, Mallorca',
  'German real estate developer who fell in love with Mallorca''s architecture and lifestyle. Moved here two years ago from Munich. Love the relaxed beach atmosphere and the exclusive events at Rendezvous. Passionate about sailing, golf, and enjoying the Mediterranean sunsets. The sunset beach BBQs are my favorite events - perfect for unwinding and connecting with great people.',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  '{"instagram": "@thomas_mueller", "linkedin": "thomas-mueller"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Demo User 6: Maria Santos
-- Email: maria.santos@email.com
-- Password: demo123
INSERT INTO users (id, email, full_name, phone, address, bio, profile_image, social_links, is_admin, friends, liked_posts, registered_events)
VALUES (
  'YOUR_UUID_6_HERE'::uuid,  -- Replace with actual UUID from Supabase Auth
  'maria.santos@email.com',
  'Maria Santos',
  '+34 971 789 012',
  'Calvià, Mallorca',
  'Spanish marketing executive and cultural event organizer. Born in Madrid, moved to Calvià three years ago for the vibrant social scene. Love the exclusive art exhibitions and jazz nights at Rendezvous - they remind me why I chose this island. Passionate about contemporary art, live music, and connecting people. The photography workshops are amazing for capturing Mallorca''s beauty. Always up for networking and making new connections!',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  '{"instagram": "@maria_santos", "facebook": "maria.santos", "twitter": "@MariaSantos", "linkedin": "maria-santos"}'::jsonb,
  false,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[]
)
ON CONFLICT (id) DO NOTHING;

