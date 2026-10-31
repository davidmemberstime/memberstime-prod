# Automated regional match play — competitor journey and draw rules

Status: product specification, not deployed. Applies independently to singles and pairs.

## Simple competitor journey
1. Join verified competition and region (based on eligible home club).
2. Receive fixture, home/away status, deadline and privacy-preserving opponent contact channel. Each side proposes dates; either confirms.
3. Play at designated host's club, subject to the club's actual guest and access policies. Never assume hosting rights or complimentary green fees.
4. Either side submits the winning entrant/team, margin, date and optional notes. Opponent confirms with one tap; disputes go to admin. For pairs, nominate a captain on each team to confirm.
5. Only once confirmed/adjudicated does the fixture become final. Both sides receive a receipt.
6. At a published round cutoff, draw the next round randomly from all eligible confirmed winners in that region. Do not draw early in a way that disadvantages late fixtures. Send next fixture notification.

## Home/away balancing
- Record home and away assignments per entrant/team (including inherited results from previous rounds).
- First round: unbiased random host assignment with public seed or independently auditable draw log.
- Later rounds: when two opponents have different net home counts, host is the one with fewer previous home fixtures; otherwise use previous venue as a tiebreak to favour alternating. If still tied, use a reproducible random choice.
- Treat a bye as **no** home or away appearance.
- Avoid impossible guarantees: two entrants who both played at home last round cannot both play away next round. State that alternation is a fairness preference, not a strict promise.
- For pairs, team history belongs to the team, not the individual members' separate singles history.
- If a club cannot host, use a mutually agreed alternative and admin approval without silently changing the fairness ledger.

## Draw integrity
- Server-side cryptographically strong randomness and an immutable draw audit record (seed/hash, timestamp, entrants, exclusions, organiser approval). The existing sorted-ID demo function must **not** be used as a production random draw.
- Round lock to prevent late result changes after pairing. Only admin can reopen, with audit trail and notifications.
- Never reveal private phone numbers/emails without consent; messaging via the platform preferred.
- Both sides can propose times and agree a date. Deadline reminders and escalation after non-response.
- Match play can finish tied after 18 holes; publish playoff/tiebreak procedure before entry.
- Opponent confirmation timeout escalates to admin; never silently auto-confirm contested scores.
- Maintain idempotent submission and confirmation; protect against two simultaneous advancement jobs.
- Withdrawals, forfeits, no-shows, byes, venue unavailability and appeals need explicit workflows.
- For a pair, a team's captain submits and the opposing captain confirms; both team members see fixture and result.

## UI
Dashboard: Next match, home/away, venue, opponent, round deadline, suggest dates, message opponent, submit result.
Result form: Winner (required), margin (required), played date, optional evidence; confirmation screen; status tracker.
Admin: entrants verification, pending fixtures, unconfirmed results, disputes, host swaps, round lock, next-round draw.

## National finals
Regional winners advance into separate singles and pairs finals at Sutton Coldfield (preferred, not booked). Top 10 singles for a possible Carnoustie invitational requires a ranking/placement format that determines places 1–10, not only a single elimination champion.
