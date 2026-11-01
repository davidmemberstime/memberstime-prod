# Members Time — automated regional match-play workflow

Status: product specification; not yet deployed or implemented.

## Entrant experience
1. Verified member enters regional singles or pairs event and accepts rules, deadlines, home club and contact preferences.
2. On draw publication, both competitors receive a fixture notification with opponent, home/away venue, deadline and secure messaging link. Neither participant's private contact details are displayed without permission.
3. Home player/team offers tee-time options; away player/team accepts. Record confirmed date and booking reference. Home club access, guest fees and host responsibility must be agreed in competition rules.
4. After play, either side submits winning entrant and match-play score (e.g. 2&1); other side confirms. Only after confirmation does the fixture become final. Disputes and non-responses route to an admin with an audit log.
5. Once all results needed for the next round are confirmed, pair winners with **auditable random draw**; avoid repeat opponents when possible, with random seed retained for transparency.
6. Allocate home advantage based on previous rounds: prefer player/team with fewer home fixtures, then the player/team whose most recent match was away, then an auditable random tiebreak. Perfect alternation is impossible when opponents share the same history.
7. Repeat until regional champion(s) qualify for the separate singles or pairs national finals.

## Safety and integrity
- Never allow one competitor to unilaterally advance by claiming a win.
- Make result submission and confirmation idempotent, atomic and server-authorised.
- Verify authenticated user is part of the fixture; pairs may require designated team captain and opponent captain.
- Use a deadline and dispute procedure for no-shows, conceded matches, unresponsive opponents and clubs refusing guest access.
- Do not expose private member phone numbers or emails by default.
- No automated draw while any prior-round fixture is unresolved, unless admin records an authorised forfeit/bye.
- Make the draw immutable once published except for a logged administrator correction.
- Define how home/away is handled when both players share the same home club, and who pays visitor green fees.

## Operational requirements
- Automated reminders before match deadline.
- Fixture notifications by email, with in-app inbox as fallback.
- Mobile-first result form with two taps for winner and score.
- Clear progress view: opponent, host club, deadline, result status, next-round waiting state.
- Separate singles and pairs draws; do not treat pairs as individuals.
- Qualification quotas and national-final format defined before entries open.

## Implementation order
1. Membership/club verification and event enrolment.
2. Database schema with RLS and fixture lifecycle.
3. Secure result confirmation and dispute handling.
4. Seeded random pairing, home-away allocation, audit log.
5. Notification delivery, admin dashboard, automated integration tests.
6. Private pilot before taking payments.
