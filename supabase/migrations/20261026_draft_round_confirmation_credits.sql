-- DEVELOPMENT ONLY: review and test in an isolated Supabase branch before applying.
-- Never execute against the shared production database as part of preview deployment.
-- Credits are ledger entries, not a client-editable balance.
create table if not exists public.reciprocal_round_confirmations (
  request_id uuid primary key references public.reciprocal_round_requests(id) on delete cascade,
  host_id uuid not null references auth.users(id),
  guest_id uuid not null references auth.users(id),
  host_confirmed_at timestamptz,
  guest_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint distinct_participants check (host_id <> guest_id)
);
create table if not exists public.host_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id),
  request_id uuid not null unique references public.reciprocal_round_requests(id),
  credits integer not null check (credits in (1,2)),
  earned_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists host_credit_ledger_host_expiry_idx on public.host_credit_ledger(host_id,expires_at);
alter table public.reciprocal_round_confirmations enable row level security;
alter table public.host_credit_ledger enable row level security;
revoke all on public.reciprocal_round_confirmations from anon, authenticated;
revoke all on public.host_credit_ledger from anon, authenticated;
grant select on public.reciprocal_round_confirmations to authenticated;
grant select on public.host_credit_ledger to authenticated;
create policy "Participants read own round confirmation" on public.reciprocal_round_confirmations
 for select to authenticated using ((select auth.uid()) in (host_id,guest_id));
create policy "Hosts read own earned credits" on public.host_credit_ledger
 for select to authenticated using ((select auth.uid())=host_id);
-- No INSERT/UPDATE/DELETE grants or policies for client roles.
-- A future authenticated server-side transaction must:
-- 1. Check approved applications, active entitlements, request status and participant identities.
-- 2. Verify BOTH participants independently confirmed completion, never allow client-supplied participant IDs.
-- 3. Lock the request, atomically insert a unique ledger entry and apply 1 or 2 credits
--    based on an admin-maintained premium-club classification, not user input.
-- 4. Enforce six earned credits in a calendar month, 3-month expiry, and auditability.
-- 5. Run positive/negative RLS and concurrency tests in isolated development.
