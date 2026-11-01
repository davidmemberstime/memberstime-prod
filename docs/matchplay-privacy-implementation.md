# Match Play privacy and deadlines

Draft branch only; not deployed or build-tested.

- /matchplay/draw checks authenticated user on server, then checks a confirmed competition entry. Fails closed when table unavailable. Standard members cannot view the draw.
- /matchplay/preview displays fictional fixtures and is publicly viewable.
- Required RLS: competition_entries users can read only their own entries; only privileged trusted workflow can confirm entries. competition_fixtures accessible only to users with confirmed entries for that competition; no anonymous reads. A page-level check does not protect the underlying Data API.
- Planned schema: competition_entries(id, competition_id, user_id, status), competition_fixtures(id, competition_id, round_number, region_code, home_label, away_label, deadline_at, status, winner_label).
- Deadline: default 42 days, configurable 30–45 days after draw publication.
- Still required: actual registration and fees, migration/RLS, result submission and confirmation, secure progression, tests and deployment. No automatic forfeits on expiry.
