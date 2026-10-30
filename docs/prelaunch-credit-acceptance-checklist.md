# Members Time — Pre-launch acceptance checklist
Status: **NOT READY FOR LIVE CREDIT BOOKINGS**. This checklist is a release gate, not evidence of passing tests.

## A. Membership and club eligibility
- [ ] Only approved, active private clubs appear in club selection and registration.
- [ ] Meyrick Park and all public/pay-and-play facilities are excluded.
- [ ] Club eligibility is checked on the server, not only through autocomplete.
- [ ] Only approved, active paid members can request or host rounds.
- [ ] A member cannot host a round at a club they have not verified as their home club.

## B. Credit accounting
- [ ] A member's available balance is calculated on the server in one transaction, including expiries and existing holds.
- [ ] Booking acceptance reserves exactly 1 credit per visitor.
- [ ] Concurrent bookings cannot reserve the same credit twice.
- [ ] A pair must contain two distinct, verified visitor accounts; each reserves their own credit.
- [ ] A host earns exactly 1.5 credits per completed round, not per visitor.
- [ ] Four rewarded hosted rounds hit the 6-credit monthly earning cap.
- [ ] Simultaneous round completions cannot exceed the monthly earning cap.
- [ ] Credits never disappear at the calendar-month boundary.
- [ ] Reward and debit posting is idempotent under retries and double clicks.
- [ ] Settlement only occurs after required confirmations, and cannot occur after cancellation.
- [ ] Reversal/refund policy is documented for disputed settlements.

## C. Cancellations and expiry
- [ ] Only the authenticated host can invoke host cancellation for an accepted booking.
- [ ] Host cancellation releases every held visitor credit in the same database transaction.
- [ ] Pair cancellations release both visitors' credits.
- [ ] Cancellation retries do not issue bonus credits or extend expiry repeatedly.
- [ ] Original credit expiry is preserved unless the host-cancellation 30-day protection is longer.
- [ ] Actual expiry-aware available balance respects that protection, including partially spent credit lots.
- [ ] Visitor cancellations and no-shows follow an approved written policy and do not automatically forfeit credits before approval.
- [ ] Repeated cancellations generate an auditable flag for human review.

## D. Security and operations
- [ ] Every credit mutation is server-controlled; no direct client INSERT/UPDATE/DELETE access.
- [ ] Verify Supabase RLS and all exposed views, including club_directory, against unauthorised reads.
- [ ] Authenticate every cancellation, acceptance and confirmation using a server-verified user identity.
- [ ] Test race conditions, database errors, retries, offline requests and expired memberships.
- [ ] Log who performed each state transition and when.
- [ ] Set up alerts for negative balances, duplicate settlements and stuck reservations.
- [ ] Confirm Vercel environment variables do not expose privileged Supabase keys to browsers.
- [ ] Test the exact preview deployment and only promote after explicit sign-off.

## E. Member experience and legal
- [ ] Members see clear available / reserved / earned / spent / expiry details.
- [ ] Booking emails and in-app notifications explain holds, cancellations and confirmations.
- [ ] Credit policy is approved and published, with version/date and acceptance tracking.
- [ ] Complete UK Terms and Conditions, Privacy Policy and consumer-law review.
- [ ] Accessibility and mobile tests on Android and iOS.
- [ ] Test all key flows with synthetic accounts and clubs, never real member balances.

## Known limitations as of 26 October 2026
- Supabase has a reservation table and a host-cancellation release trigger, but there is no complete authenticated booking and settlement workflow.
- The cancellation actor column is not, by itself, proof that the user was authenticated as that actor; enforce in trusted server code.
- Expiry protection is recorded on released reservations but is **not yet applied to the underlying credit-lot accounting**.
- The current read-only wallet preview is provisional: summing unexpired ledger entries is not sufficient for accurate FIFO credit-lot expiry, especially if older debits are retained while older credits expire.
- Wallet checks are committed but not yet executed in CI.
- Club-directory security_invoker migration was applied, but broader access regression tests remain outstanding.
- Do not advertise automatic credit refunds or enable paid-member bookings until these checks pass.
