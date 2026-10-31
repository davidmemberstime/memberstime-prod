-- DEVELOPMENT DRAFT ONLY — DO NOT APPLY TO SHARED PRODUCTION SUPABASE.
-- Friendship is bilateral: a pending invitation cannot be used as an accepted partner.
create table if not exists public.member_friendships (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid not null references auth.users(id),
  invitee_id uuid not null references auth.users(id),
  status text not null default 'pending' check (status in ('pending','accepted','declined','removed')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint member_friendships_distinct check (inviter_id <> invitee_id),
  constraint member_friendships_unique unique (inviter_id,invitee_id)
);
create index if not exists member_friendships_invitee_idx on public.member_friendships(invitee_id,status);
alter table public.member_friendships enable row level security;
revoke all on public.member_friendships from anon,authenticated;
grant select on public.member_friendships to authenticated;
create policy "Participants can read their friendship" on public.member_friendships
for select to authenticated using ((select auth.uid()) in (inviter_id,invitee_id));
-- Client writes intentionally disabled pending secure server-side invitation and
-- acceptance endpoints. Verify both approved/active memberships before creation,
-- prevent reverse duplicates, restrict transitions, and allow removal/blocking.
-- Future paired visit requests must check accepted friendship, both visitors'
-- membership eligibility, the host's explicit consent for 2 visitors, and
-- independently debit each visitor's allowances in one atomic transaction.
