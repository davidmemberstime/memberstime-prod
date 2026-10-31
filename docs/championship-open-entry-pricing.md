# Members Time Championships — open eligibility and pricing proposal

**Status:** Product decision draft; not implemented in payment, registration, public site or database.

## Eligibility
Championships are open to (a) active Members Time subscribers and (b) non-subscribers who are independently verified as current members of a golf club on the competition's approved eligible-club list. Non-subscribers receive competition-only access, not reciprocal exchange, member directory, friends or credit privileges. Every competitor must satisfy eligibility, handicap and club visitor requirements; verify both golfers on pairs teams.

## Entry fees (per season, all rounds included)
| Category | Members Time | Non-member |
| Singles | £39 | £69 |
| Pairs (both Members Time) | £69 per team | |
| Pairs (one subscriber, one non-subscriber) | £94 per team | |
| Pairs (both non-subscribers) | | £119 per team |

Prices are proposals subject to final approval and unit economics. Membership status and pricing are assessed at registration under a published policy. No new qualification fee for regional, super-regional or national stages. Course guest fees, travel, lodging and other optional expenses are not automatically included. No guarantee of free rounds or admission to restricted clubs.

## Tournament progression
Local regional brackets → wider super-regional Gold/Silver brackets → national Gold Cup/Silver Plate, separately for singles and four-ball better-ball pairs. Regional winners go Gold; runners-up go Silver. Published qualification, handicap, scoring, tie-break and scheduling rules required.

## Engineering
Build a separate competition participant identity/verification pathway that does not grant Members Time subscription entitlements. Registration must support solo, both-subscriber pair, mixed pair and both-non-subscriber pair, with server-side eligibility and fee calculation. Do not rely on client-provided subscriber status. Protect entrant contact details, use payment webhooks for confirmed entries, prevent duplicate teams/entries, and support admin review.

## Marketing
Position as an exclusive championship for eligible leading-club members, including non-subscribers. Do not claim every club is verified or eligible until the club list has been audited.
