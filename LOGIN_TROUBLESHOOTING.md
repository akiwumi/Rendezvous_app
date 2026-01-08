# Login Troubleshooting Guide

## Issue: Cannot Login to Eugene Akiwumi Account

### Step 1: Verify Auth User Exists

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Search for email: `akiwumi@gmail.com`
3. Check:
   - ✅ User exists
   - ✅ Email matches exactly: `akiwumi@gmail.com`
   - ✅ User is **Confirmed** (look for checkmark or "Confirmed" status)
   - ✅ Password is set to `1234`

**If user doesn't exist:**
- Create new user:
  - Email: `akiwumi@gmail.com`
  - Password: `1234`
  - **Auto Confirm User**: ✅ YES (important!)
  - Click "Create User"
  - **Copy the UUID** that gets generated

**If user exists but is not confirmed:**
- Click on the user
- Click "Confirm" button to manually confirm the user

### Step 2: Verify User Profile Exists in Database

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this query:

```sql
SELECT id, email, full_name, is_admin 
FROM users 
WHERE email = 'akiwumi@gmail.com';
```

**Expected Result:**
- Should return 1 row
- `id` should be: `055f4406-9903-467d-9b28-8701765201df`
- `email` should be: `akiwumi@gmail.com`
- `full_name` should be: `Eugene Akiwumi`
- `is_admin` should be: `true`

**If no rows returned:**
- The user profile doesn't exist in the database
- Run `supabase/QUICK_SETUP_EUGENE.sql` with your actual UUID

**If UUID doesn't match:**
- The UUID in the database must match the UUID from Auth
- Update the SQL script with the correct UUID and run it again

### Step 3: Check UUID Match

The UUID in Supabase Auth must match the UUID in the users table:

1. **Get UUID from Auth:**
   - Go to Authentication → Users
   - Find `akiwumi@gmail.com`
   - Copy the UUID (starts with something like `055f4406-...`)

2. **Check UUID in Database:**
   ```sql
   SELECT id FROM users WHERE email = 'akiwumi@gmail.com';
   ```

3. **If they don't match:**
   - Update the users table with the correct UUID from Auth
   - Or delete and recreate both (see Step 5)

### Step 4: Verify Supabase Connection

Check if the app can connect to Supabase:

1. Open browser console (F12)
2. Try to login
3. Look for errors in console

**Common errors:**
- `Invalid login credentials` - Email/password incorrect or user not confirmed
- `User not found` - User doesn't exist in database
- `Network error` - Supabase connection issue

### Step 5: Reset User (If Needed)

If nothing works, delete and recreate:

**Delete from Database:**
```sql
DELETE FROM users WHERE email = 'akiwumi@gmail.com';
```

**Delete from Auth:**
- Go to Authentication → Users
- Find `akiwumi@gmail.com`
- Click "Delete User"

**Recreate:**
1. Create auth user (see Step 1)
2. Copy the new UUID
3. Run `supabase/QUICK_SETUP_EUGENE.sql` with the new UUID

### Step 6: Test Login

1. Clear browser cache/cookies (optional but recommended)
2. Go to login page: `http://localhost:5173/login`
3. Enter:
   - Email: `akiwumi@gmail.com`
   - Password: `1234`
4. Click "Login"

**Expected behavior:**
- Should redirect to `/announcements` page
- No error messages
- Admin profile accessible at `/admin-profile`

### Common Issues and Solutions

#### "Invalid email or password"
- **Cause**: Password incorrect or user not confirmed
- **Solution**: Check password is `1234` and user is confirmed in Auth

#### "User data not found in database"
- **Cause**: Auth user exists but profile doesn't exist in users table
- **Solution**: Run `supabase/QUICK_SETUP_EUGENE.sql` with correct UUID

#### "Email not confirmed"
- **Cause**: User was created but not confirmed
- **Solution**: Go to Auth → Users → Find user → Click "Confirm"

#### UUID Mismatch
- **Cause**: UUID in Auth doesn't match UUID in database
- **Solution**: Either:
  1. Update database UUID to match Auth UUID
  2. Delete both and recreate with matching UUIDs

### Quick SQL Commands

**Check if user exists and is admin:**
```sql
SELECT id, email, full_name, is_admin, created_at
FROM users 
WHERE email = 'akiwumi@gmail.com';
```

**Make user admin (if exists but not admin):**
```sql
UPDATE users 
SET is_admin = true 
WHERE email = 'akiwumi@gmail.com';
```

**Update UUID if wrong:**
```sql
UPDATE users 
SET id = '055f4406-9903-467d-9b28-8701765201df'::uuid
WHERE email = 'akiwumi@gmail.com';
```

**Verify all auth users:**
- Go to Authentication → Users
- Look for `akiwumi@gmail.com`
- Check status, confirmation, and UUID

