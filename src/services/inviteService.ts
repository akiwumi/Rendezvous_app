/**
 * Invite Service
 * Manages invite codes for the private club.
 */

import { supabase } from '../lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Create invite via DB (no email). */
export async function createInvite(email: string) {
  const code = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
  const { data, error } = await supabase.from('invites').insert({
    email,
    code,
    expires_at: expiresAt,
  }).select().single();
  if (error) throw error;
  return data;
}

/** Create invite + send email via Edge Function. */
export async function sendInvite(email: string) {
  const res = await fetch(`${supabaseUrl}/functions/v1/send-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send invite');
  return data;
}

/** Validate invite code (from invites table). Returns invite row or null. */
export async function validateInvite(code: string) {
  const { data } = await supabase
    .from('invites')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  return data;
}

/** Mark invite as used (direct update). */
export async function useInvite(invite: { id: string }) {
  const { error } = await supabase
    .from('invites')
    .update({ used: true })
    .eq('id', invite.id);
  if (error) throw error;
}

/** Get all invites (for admin). */
export async function getAllInvites() {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
