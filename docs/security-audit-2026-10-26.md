# Members Time — production security audit (26 October 2026)

**Read-only audit. No live database changes applied.**

## Priority 0: exposed SECURITY DEFINER view
Supabase security advisor reports `public.club_directory` as SECURITY DEFINER. Review the view definition and permissions before changing it. Prefer a security-invoker view where appropriate, then regression-test all directory queries. https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view

## Priority 0: callable SECURITY DEFINER function
`public.handle_new_user()` is executable by both `anon` and `authenticated`. Inspect its trigger dependencies and implementation; revoke direct execution from client roles if it is trigger-only. Test new-user sign-up before rollout. https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable

## Priority 1: application eligibility server-side
Current RLS permits any signed-in user to INSERT a pending application with an arbitrary `home_club`. Client-side autocomplete is not a security boundary. Create an admin-maintained canonical club table with distinct eligibility states and validate inserts against it in database/server code; retain an exception-review channel for legitimate members of unlisted clubs. Existing approvals must not be automatically revoked.

## Priority 1: discovery profile integrity
Current member discovery UPDATE policy permits owner updates while only checking `user_id`; the client treats `home_club` as read-only but RLS does not guarantee it matches an approved application. Enforce verified home-club association in database logic and prevent arbitrary updates to sensitive verification attributes.

## Priority 1: round request transitions
Recipient can accept or decline pending introductions and requester can cancel pending ones. Review column-level update grants and add transition validation so participants cannot modify `requester_id`, `recipient_id` or unrelated fields in the same UPDATE. RLS status checks alone do not prevent changes to other columns.

## Priority 1: credit award transaction
A separate confirmation and ledger migration is drafted at `supabase/migrations/20261026_draft_round_confirmation_credits.sql`. It is not applied or complete. Build a server-validated, idempotent double-confirmation workflow with row locking, monthly cap, three-month expiry, and controlled high-demand club tiering. Never award credits on client confirmation alone.

## Priority 2: API surface and account protection
Security advisor warns of GraphQL exposure of tables to `anon` and `authenticated`. Evaluate table by table against RLS and business needs; GraphQL discoverability is not itself proof of a data leak. It also reports mutable search_path on `public.set_updated_at`, RLS-enabled import tables without policies, and disabled leaked-password protection. https://supabase.com/docs/guides/database/database-linter

## Test gates before release
1. Isolated development database, separate credentials, and non-production test users.
2. Negative tests: anonymous applicant, forged club, unapproved viewer, expired member, profile club tampering, forged request participant IDs, repeated confirmation, self-awarded credits, race between simultaneous confirmations.
3. Positive tests: genuine applicant, admin review, verified profile, member introductions, both-party confirmation, 1/2 credit awards, monthly cap, expiry.
4. Review security advisor again; deploy and test preview before any production migration.
