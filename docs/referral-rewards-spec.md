# Members Time — referral rewards proposal (development only)

## Proposed programme
- Each approved member receives a personal invitation link or code.
- Referrer receives **2 bonus away-round credits** after the invited golfer is independently verified, approved and makes their first successful paid membership payment.
- Maximum **6 rewarded referrals / 12 bonus credits per rolling 12 months** per referring account.
- Each awarded referral credit expires **12 months from award**; it is distinct from hosting credits (currently proposed three-month expiry).
- Credits cannot be sold, transferred, redeemed for cash, or used to bypass a host's approval, guest fees, club rules or playing availability.
- An invitation is not a friendship connection; recipients must separately consent to any friend request.
- A member who adds a paid playing partner can qualify for the same referral reward, but only once per newly paid account; joining as a pair does not create two rewards automatically.
- Reward not issued during free founding months; award only after a qualifying paid subscription starts.
- Refund, chargeback, duplicate-account, self-referral and cancellation-before-qualification cases are ineligible; consider reversing fraudulently awarded unspent credits.
- Do not show a functioning invite link or credit balance until secure APIs and payment events are in place.

## Data and implementation
Use server-issued opaque referral tokens (not email addresses or membership numbers), authenticated invite attribution, uniqueness on referee, an immutable referral reward ledger with event idempotency, verified payment webhook signature and anti-abuse checks. Do not let clients mutate referrals or balances directly. Enforce annual cap and expiry server-side. Members can see their own invitations and rewards only.

## UX
Member dashboard: Invite a Golfer card, Copy invitation link, referral status (invited, applied, approved, paid, rewarded), earned/available credits and expiry. Member profile: Friends & Playing Partners is separate, with optional friend request after sign-up. Pair pricing remains £29.50 per member versus £39 individual, subject to verified pairing and live billing.

**Status:** Product specification only. No live referral links, payment logic, credit awards, or database changes.
