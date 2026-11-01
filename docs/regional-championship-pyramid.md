# Members Time championship pyramid — product specification

Status: proposal, not publicly announced. Venues and qualification allocations are provisional.

## Competition structure

1. **Regional championships**: separate singles and betterball pairs knockout draws. Regions are configurable geographic clusters (examples: Surrey; Dorset & Hampshire; Midlands; Yorkshire). Participants must be verified current members of a club on the vetted eligible Top 100 list. An England ranking is not automatically a ranking for Scotland/Wales/Ireland; record the governing ranking edition and geography.
2. **England national finals**: qualifying singles players and pairs teams from each region compete in their own finals at the preferred Sutton Coldfield Golf Club venue. No agreement or rate is in place. Qualification quotas must be published before registration, including what happens if a region has too few entries.
3. **Champions' Invitational**: a separate, optional premium event for top performers from the national finals. Carnoustie is a potential venue only; not booked or affiliated. Qualification might be top 10 singles players and five pairs teams, but must be decided before entries open.

## Format details requiring rules before launch
- Regional placement: use verified home-club region, not arbitrary postcode, with an approved exception process for border clubs.
- Separate competition types: singles entrants are individual users; pairs entrants are immutable two-member teams with both verified and eligible.
- Prevent a person appearing twice in one pairs draw. Decide whether singles and pairs entries can overlap.
- For odd numbers, deterministic byes; for regional draws, publish seeding and randomisation method. Current sorted-ID demo planner is not a fair production draw and must not be used to assign real opponents.
- Regional winners progress to national finals only after two-party result confirmation and admin adjudication of disputes.
- National finals and Champions' Invitational may need a different format from knockout match play to rank a top 10; specify stroke play, stableford, placement playoffs or another fair tie-break method.
- Define handicap eligibility, WHS allowance, pairs handicaps, tee policy, playing conditions, travel responsibility, entry fees, refunds and dispute deadlines.
- Set region quotas before taking payment; quotas must accommodate field size at Sutton Coldfield.
- Venue booking, written permission to use brand in promotion, and event insurance before marketing confirmed finals.

## Data design (not deployed)
- competitions: id, format ('singles'|'pairs'), season, status, rules_version.
- competition_regions: competition_id, region_code, region_name, entry_cap, national_qualifier_quota.
- competition_entries: competition_id, entry_id, region_code, status, verified_at.
- competition_team_members: entry_id, user_id (two members for pairs, one for singles).
- competition_fixtures: competition_id, region_code, stage, round_number, entry_a, entry_b, status, deadline.
- competition_results: fixture_id, winning_entry_id, submitted_by, opponent_confirmed_at, adjudicated_by.
- championship_qualifications: source_competition_id, entry_id, destination_event_id, rank, qualification_reason.
- event_venues: event_id, venue_name, contract_status, cost_basis, date.

## Launch blockers
- Vet and populate eligible club directory; define accepted ranking source and year.
- Obtain written venue quotes and confirm final event format/capacity.
- Build authenticated and auditable DB mutations, with RLS, server-side membership checks, idempotency and concurrency tests.
- Obtain authorised handicap verification or design a privacy-compliant manual fallback.
- Do not enable registration or collect money until terms, insurance and competition operations are approved.
