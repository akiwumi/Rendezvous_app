-- Allow admins to promote/demote other users (update is_admin)
-- Run in Supabase Dashboard > SQL Editor
-- Required for "Make admin" / "Remove admin" in Admin Console

DROP POLICY IF EXISTS "Admins can update other users" ON users;

CREATE POLICY "Admins can update other users"
ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.is_admin = true
  )
);
