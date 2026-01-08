# Reset Eugene Akiwumi Password

## The Issue
You're getting "Invalid login credentials" which means either:
1. The password in Supabase Auth is NOT `1234`
2. The user is not confirmed
3. The email doesn't match exactly

## Solution: Reset Password in Supabase

### Option 1: Update Password in Supabase Dashboard (Easiest)

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find `akiwumi@gmail.com`
3. Click on the user to open details
4. Click **"Reset Password"** or **"Update Password"**
5. Set new password to: `1234`
6. Click **"Save"** or **"Update"**
7. **IMPORTANT**: Make sure **"Email Confirmed"** is checked/confirmed

### Option 2: Delete and Recreate User

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find `akiwumi@gmail.com`
3. Click **"Delete User"** (or three dots menu → Delete)
4. Click **"Add User"**
5. Fill in:
   - **Email**: `akiwumi@gmail.com`
   - **Password**: `1234`
   - **Auto Confirm User**: ✅ **YES** (Very Important!)
   - **Send Invite Email**: ❌ No
6. Click **"Create User"**
7. **Copy the UUID** that appears
8. Run `supabase/QUICK_SETUP_EUGENE.sql` with the new UUID

### Option 3: Use Supabase SQL to Update Password (Advanced)

```sql
-- This requires the auth schema access
-- Usually better to use the Dashboard method above
```

## Verify User is Confirmed

1. Go to **Authentication** → **Users**
2. Find `akiwumi@gmail.com`
3. Check the status:
   - Should show "Confirmed" or green checkmark
   - If not confirmed, click on user → Click **"Confirm"** button

## Test Login Again

After resetting password:
1. Go to `http://localhost:5173/login`
2. Email: `akiwumi@gmail.com`
3. Password: `1234`
4. Click Login

## Common Issues

### "User not confirmed"
- Solution: Go to Auth → Users → Find user → Click "Confirm"

### "Password doesn't work"
- Solution: Reset password in Dashboard (Option 1 above)

### "Email doesn't match"
- Make sure email is exactly: `akiwumi@gmail.com` (lowercase, no spaces)

