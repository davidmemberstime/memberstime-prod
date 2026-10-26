# Members Time — premium members network migration

## Design preservation
Retain the existing visual identity: dark forest-green backgrounds, gold accents, golf-course hero photography, existing Members Time logo, generous typography and premium club atmosphere. Do not replace the homepage artwork without visual review.

## New positioning
An invitation-led network for verified members of selected premium golf clubs to arrange reciprocal rounds and friendly competitive matches with peers. This is **not** a guest/host fee marketplace. All matches remain subject to each club's guest and visitor rules.

## Existing code to retain and adapt
- `src/app/page.tsx`: retain visual layout/assets; replace guest/host language.
- `src/components/SiteHeader.tsx`: adapt navigation to How It Works, Clubs, League, Membership, Sign In.
- `src/app/auth/*`: preserve Supabase auth structure; update onboarding and verification.
- `src/app/clubs/*`: retain club pages; replace host fees with eligible member matching.
- `src/app/member-dashboard/*`: replace paid booking requests with reciprocal match requests.
- Stripe endpoints: **do not enable existing per-guest booking checkout** for new subscriptions.

## Proposed member journey
1. Apply with name, home club, membership status and handicap; collect only necessary personal data.
2. Verify club membership through an appropriate approved process; review applications.
3. Activate paid subscription after verification.
4. Browse eligible clubs/members subject to privacy and club rules.
5. Request a reciprocal match; recipient can accept or decline.
6. Record completed rounds and voluntary hosting contribution.
7. Join county fixtures and opt-in league competitions.

## Database draft (not yet applied)
`clubs`, `profiles`, `club_memberships`, `verification_requests`, `subscription_entitlements`, `match_requests`, `matches`, `hosting_credits_ledger`, `league_seasons`, `league_divisions`, `fixtures`, `results`.
Require row-level security and explicit authorisation for private member records. Keep DOB, contact details, CDH/handicap identifiers private.

## Blockers and safeguards
- Supabase project is INACTIVE; inspect/restore existing data before any migrations.
- Confirm the current pricing tier before implementing Stripe products.
- Test build, sign-up, permissions, payment webhooks and club policy enforcement in preview.
- Never modify `main` or deploy to production without review.
