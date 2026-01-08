# Admin Profile Setup: Eugene Akiwumi (Pebbles)

## Profile Information
- **Full Name**: Eugene Akiwumi
- **Display Name**: Pebbles
- **Email**: akiwumi@gmail.com
- **Login Email**: akiwumi@gmail.com
- **Password**: 1234
- **Profile Image**: `/pebbles.jpg`

## Setup Steps

### 1. Profile Image
The profile image is already set to use `/pebbles.jpg` which exists in the `public` folder.
If you want to use a different image:
- Save it as `pebbles.jpg` in the `public` folder, OR
- Update the image path in `src/data/dummyData.ts` and `supabase/SUPABASE_ADMIN_EUGENE.sql`

### 2. Create Admin User in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Click **Add User** (or **Invite User**)
4. Fill in:
   - **Email**: `akiwumi@gmail.com`
   - **Password**: `123456`
   - **Auto Confirm User**: ✅ Yes
   - **Send Invite Email**: ❌ No (optional)
5. Click **Create User**
6. **Copy the User UUID** that gets generated

### 3. Update Database

1. Open `supabase/SUPABASE_ADMIN_EUGENE.sql`
2. Replace `'YOUR_USER_UUID_HERE'` with the actual UUID from Step 2
3. Run the SQL script in Supabase SQL Editor

### 4. Verify Setup

1. Login to the app using:
   - Email: `akiwumi@gmail.com`
   - Password: `123456`
2. Navigate to the Admin Profile page
3. Verify that the profile shows:
   - Name: Eugene Akiwumi
   - Profile image loads correctly
   - Admin badge is visible

## Notes

- The username "Pebbles" can be used as a display name or in social links
- The login uses email: `akiwumi@gmail.com`
- All admin features should be accessible after login
- The profile image path is set to `/eugene-akiwumi.png` in the code

