/**
 * Invite Service
 * Manages invite codes for the private club.
 */

import { supabase } from '../lib/supabase';

export async function createInvite(email: string) {
  const code = crypto.randomUUID(); // secure + unique

  const { data, error } = await supabase.from('invites').insert({
    email,
    code,
  }).select().single();

  if (error) throw error;
  return data;
}
