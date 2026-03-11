-- Allow direct update to mark invite as used (alternative to use_invite RPC)
create policy "Allow update to mark used"
  on invites for update
  to anon, authenticated
  using (used = false and (expires_at is null or expires_at > now()))
  with check (used = true);
