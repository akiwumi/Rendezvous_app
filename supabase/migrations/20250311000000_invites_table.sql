-- Invites table: email invites with code, used flag, expiry
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null unique,
  used boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists invites_code_idx on invites (code);
create index if not exists invites_email_idx on invites (email);

-- RLS: allow anon to validate codes (select), service role for all
alter table invites enable row level security;

create policy "Allow select for invite validation"
  on invites for select
  to anon, authenticated
  using (true);

create policy "Service role full access"
  on invites for all
  to service_role
  using (true)
  with check (true);

-- RPC to mark invite as used (validates first, prevents abuse)
create or replace function use_invite(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  update invites
  set used = true
  where code = p_code
    and used = false
    and (expires_at is null or expires_at > now());
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- Allow anon and authenticated to call use_invite
grant execute on function use_invite(text) to anon;
grant execute on function use_invite(text) to authenticated;
