# Members Time — membership partner and golfing friends rules

## Two independent relationships
**Billing partner:** at most one mutually confirmed linked partner per member, both approved, active and individually billed £29.50/month. Neither may be in another billing pair. Both keep full single-member privileges and personal allowances. Unlinking requires notice and future billing change; never silently reprice an active subscription.

**Golfing friends:** unlimited accepted, bilateral connections. Members may invite, accept, decline, remove, block and favourite friends independently of their billing partner. Friendship alone does not confer paid membership or club eligibility. Do not expose a member's friends list publicly.

## Paired away-round request
1. Member selects **Play solo** (default) or **Play with a partner**.
2. Partner picker shows confirmed, eligible friends, favourites first. Billing partner may be preselected but is not required.
3. Both visitors individually approve participation. Host sees both names, home clubs, handicaps where voluntarily shared, and number of visitors before accepting.
4. Host may decline two visitors even when willing to host one. A request is not a tee-time booking.
5. On both visitor approvals and host acceptance, check each account's active status and allowances again. Reserve/debit one appropriate allowance per visitor atomically; never charge one visitor for the other without explicit authorisation. Handle cancellations with defined reversals.
6. Avoid double booking, concurrent overspending, changed partner after acceptance, and friend removal while a request is pending.

## Referrals
One personal invite link per member; 1.5 credits for the referrer after a unique referee's first successful paid subscription, 6 rewarded referrals / 9 credits per rolling 12 months, 12-month reward expiry. Founding free months don't trigger rewards. Friend invitations and referrals are separate opt-ins. No client-authoritative credit ledger.

## Implementation order
1. Separate development database and test accounts.
2. Bilateral friendships, member blocks, favourites, and a one-to-one billing-partner link with database constraints.
3. Authenticated server endpoints for invitation, response, unlinking and member eligibility checks; automated negative tests.
4. Profile Friends & Playing Partners UI and favourites.
5. Paired introduction workflow and acceptance by both visitors and host.
6. Payment provider integration and subscription change workflow; test webhook idempotency and cancellations.
7. Referral attribution and rewards ledger with expiry and caps.
8. Mobile, accessibility, privacy, fraud and end-to-end tests; controlled production release.

**Safety:** This document does not activate any feature. Do not apply draft migrations or change production data until tested and approved.
