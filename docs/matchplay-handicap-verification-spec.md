# Members Time — Match Play & Handicap Verification (pre-launch specification)

Status: design only. Do not enable registrations or imply England Golf/WHS authorisation.

## Registration
- Applicant chooses an approved club from the vetted directory.
- Collect full name, country of handicap authority, WHS/CDH number where available, home club, and consent to a clearly specified verification process.
- Never equate a typed handicap number with verified current club membership.
- Store verification status as `unverified`, `pending`, `verified`, `rejected`, or `expired`; record method, verified timestamp, and reviewer/provider, not public handicap identifiers.
- Provider response must match the applicant's identity and eligible home club. Mismatches enter manual review, not automatic rejection.
- Offer a membership card or direct club confirmation as a fallback. Club verification must be periodically rechecked.
- No external WHS API calls until a written licence, lawful basis, data processing terms, rate limits and supported jurisdictions are confirmed.

## Match play championship
- Treat tournament entry as a distinct opt-in from reciprocal membership.
- Admin creates a competition with format, entry window, eligibility, handicap allowance, divisions, regional draw, round deadlines, venue, prizes, tie-breaking and withdrawal policy.
- Entrants must have a verified active home club and approved competition eligibility; lock an audit snapshot of handicap/club at entry, and specify if handicap changes affect subsequent rounds.
- Do not assume a universal WHS allowance: obtain governing-body guidance and publish the exact rules before entry.
- Entrants submit results with opponent confirmation; disputes require an administrator. Every override is audited.
- Pairing and home advantage must be deterministic and visible in the published rules; never expose private contact details until both parties opt in.
- Provide a bracket, fixture detail, result submission, opponent confirmation, deadline reminders and dispute queue.
- Tournament scores must not be posted to WHS without appropriate authorisation and qualifying status.

## Proposed data model (NOT DEPLOYED)
- `member_verifications`: user_id, authority, external_reference_encrypted, claimed_club_id, status, verified_club_id, method, verified_at, expires_at, reviewed_by, consent_version.
- `competitions`: id, name, format, state, entry_open_at, entry_close_at, rules_version.
- `competition_entries`: id, competition_id, member_id, verification_snapshot, entered_at, status; unique competition/member.
- `match_fixtures`: id, competition_id, round_number, player_a, player_b, deadline, status, winner_id.
- `match_result_submissions`: fixture_id, submitted_by, score, submitted_at, opponent_confirmed_at, dispute_reason.
- `competition_audit_events`: actor_id, entity, action, before/after, timestamp.
- All tables require appropriate RLS and server-side state-transition controls before deployment.

## Release checks
- Unverified member cannot enter; member at noneligible club cannot enter.
- WHS lookup outage routes to pending/manual review without granting access.
- Duplicate entry and duplicate result submission do not duplicate fixtures or advance brackets.
- A result cannot be self-confirmed by the submitting player.
- Bracket advancement is atomic and idempotent, including concurrent submissions.
- Draw cannot be changed silently after publication.
- Admin overrides require an audit record.
- GDPR notices, retention/deletion schedules and competition terms approved.
