# Seeding Supabase with Test Data

This guide explains how to populate your Supabase database with the dummy data that was previously in the codebase.

## Steps to Seed Data

### 1. Create Admin User in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** (or **Invite User**)
4. Enter:
   - Email: `pernilla@rendezvous.club`
   - Password: (set a secure password)
5. Click **Create User**
6. **Copy the UUID** of the newly created user (you'll need this)

### 2. Update the Seed SQL Script

1. Open `SUPABASE_SEED_DATA.sql`
2. Find the admin user INSERT statement (around line 10)
3. Replace `gen_random_uuid()` with the actual UUID you copied:
   ```sql
   VALUES (
     'YOUR_ADMIN_UUID_HERE', -- Replace with actual UUID
     'pernilla@rendezvous.club',
     ...
   )
   ```

### 3. Run the Seed Script

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire contents of `SUPABASE_SEED_DATA.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

### 4. Verify Data

After running the script, verify the data was inserted:

1. Go to **Table Editor** in Supabase Dashboard
2. Check the following tables:
   - `users` - Should have 7 users (1 admin + 6 dummy users)
   - `announcements` - Should have 5 announcements
   - `events` - Should have 8 events
   - `posts` - Should have 2 posts

### 5. Update Friend References (Optional)

The friends arrays in the users table reference user IDs. After all users are inserted, you may want to update these references with actual UUIDs. You can do this by:

1. Querying the users table to get UUIDs:
   ```sql
   SELECT id, email, full_name FROM users;
   ```

2. Updating the friends arrays with actual UUIDs (if needed)

## Troubleshooting

### Error: "duplicate key value violates unique constraint"

This means some data already exists. The script uses `ON CONFLICT (id) DO NOTHING` to handle this, but if you want to start fresh:

1. Delete existing data from tables (in order):
   ```sql
   DELETE FROM event_attendees;
   DELETE FROM notifications;
   DELETE FROM posts;
   DELETE FROM events;
   DELETE FROM announcements;
   DELETE FROM users;
   ```

2. Then run the seed script again

### Error: "foreign key constraint"

Make sure you've:
1. Run `SUPABASE_SCHEMA.sql` first
2. Created the admin user in Auth before running the seed script
3. Used the correct admin UUID in the seed script

### Friends/Posts/Events Arrays Are Empty

After inserting all data, you may need to update the arrays with actual UUIDs. The seed script uses placeholder references. You can update them manually or create a follow-up script.

## Next Steps

After seeding:
1. Test user registration and login
2. Verify posts, events, and announcements load correctly
3. Test event registration functionality
4. Check that notifications work

The app will now load all data from Supabase instead of using dummy data from the codebase.

