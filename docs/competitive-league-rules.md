# Members Time — National Competitive League (approved concept, 31 October 2026)

## Core concept
- One UK-and-Ireland-wide match-play league; no fixtures, geographical divisions or assigned opponents.
- Any two verified, competitively subscribed members may arrange a ranked match through the existing club browsing and booking flow, subject to host acceptance and venue rules.
- Friendly/reciprocal rounds remain available for non-competitive members.

## Qualification
- Each season lasts 12 months (exact start/end dates to be configured).
- Exactly six designated home results and six designated away results count toward championship eligibility and the leaderboard.
- A member qualifies for final standings after completing all twelve.
- No rigid monthly deadlines; target one ranked match per month, with flexibility for holidays and weather.
- Designation must occur **before tee-off**, to prevent retrospective cherry-picking.
- Members may play additional matches socially; decide separately whether they affect a secondary all-matches record.
- An away member's match is simultaneously the host member's home match only when both opted in to competitive play and both have an eligible slot remaining.

## Scoring
| Result | Home | Away |
| --- | ---: | ---: |
| Win | 3 | 4 |
| Draw | 1 | 2 |
| Loss | 0 | 0 |

Use handicap-based singles match play; confirm the exact handicap allowance and stroke index method before implementation. A conceded match or no-show requires separate dispute handling.

## Product work
1. Competitive opt-in and paid add-on status in member profile.
2. Booking flow option to request a ranked match; both players must consent.
3. Eligibility checks: verified membership, subscription, match slots, distinct participants, completed booking.
4. Results entered and confirmed by both players, with disputes/admin resolution and audit log.
5. Live leaderboard with home/away counts, points, wins/draws/losses, qualification progress, tie-breakers TBD.
6. End-of-season championship bracket and qualification logic, to be confirmed.
7. Prevent result duplicates and match manipulation; define cancellations, repeat opponents, abandoned matches, late joiners and appeals.

**Status:** Approved competition concept. Not a claim that these features are already implemented or deployed.

## Registration and pricing update (approved 31 October 2026)
- Registration must present a clear mutually exclusive choice: **Playing for fun** (standard membership) or **Competitive golfer** (optional add-on).
- Competitive membership costs **an additional £10 per month**, replacing the earlier proposed £5 add-on. For a £39/month standard single membership, the combined price is **£49/month** (subject to the actual checkout base price).
- Competitive league is **singles match play only**. Pairs and team matches do not count toward league standings; this does not necessarily remove existing paired social membership features.
- Add a small accessible info control next to Competitive golfer, opening a modal/popover explaining: twelve ranked singles matches per season, six home and six away, flexible self-arranged opponents across UK/Ireland, handicap match play, home win 3/away win 4/home draw 1/away draw 2/loss 0, qualification for national leaderboard and finals, and +£10/month.
- Do not preselect the paid add-on; clearly disclose the total recurring price before checkout and record the user's explicit selection. Support changing participation later, with season eligibility rules to be defined.
- Implementation must update registration UI, server-side membership state, checkout/subscription billing, and competitive eligibility consistently; do not treat a UI-only change as complete.
