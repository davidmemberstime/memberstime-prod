/**
 * Pure, side-effect-free knockout bracket planner.
 * Not an authorisation boundary. Do not use to commit results to the database.
 */
export type Entrant = { id: string; region: string };
export type Pairing = { id: string; round: number; region: string; playerA: string; playerB: string | null; bye: boolean };
export type MatchDecision = { fixtureId: string; winnerId: string; confirmedBy: string[] };
export type ResultCheck = { ok: true } | { ok: false; reason: string };

export function planRegionalFirstRound(entrants: readonly Entrant[]): Pairing[] {
 const seen = new Set<string>();
 for (const e of entrants) {
  if (!e.id.trim() || !e.region.trim()) throw new Error("Entrant ID and region required");
  if (seen.has(e.id)) throw new Error("Duplicate entrant");
  seen.add(e.id);
 }
 const groups = new Map<string, string[]>();
 for (const e of entrants) groups.set(e.region, [...(groups.get(e.region) ?? []), e.id]);
 const pairings: Pairing[] = [];
 for (const region of [...groups.keys()].sort()) {
  const ids = [...groups.get(region)!].sort();
  for (let i = 0; i < ids.length; i += 2) {
   const second = ids[i + 1] ?? null;
   pairings.push({ id: `r1-${encodeURIComponent(region)}-${i / 2 + 1}`, round: 1, region, playerA: ids[i], playerB: second, bye: second === null });
  }
 }
 return pairings;
}

/** Requires confirmation by both distinct opponents for a contested match. */
export function validateMatchDecision(fixture: Pairing, decision: MatchDecision): ResultCheck {
 if (fixture.id !== decision.fixtureId) return { ok: false, reason: "Wrong fixture" };
 if (fixture.bye) return { ok: false, reason: "Bye must be advanced by the tournament service" };
 if (decision.winnerId !== fixture.playerA && decision.winnerId !== fixture.playerB) return { ok: false, reason: "Winner is not an opponent" };
 const confirmations = new Set(decision.confirmedBy);
 if (fixture.playerB === null || confirmations.size !== 2 || !confirmations.has(fixture.playerA) || !confirmations.has(fixture.playerB)) {
  return { ok: false, reason: "Both opponents must confirm" };
 }
 return { ok: true };
}

/** Idempotent round advancement from already-authorised, confirmed results. */
export function nextRoundCandidates(fixtures: readonly Pairing[], decisions: readonly MatchDecision[]): string[] {
 const byFixture = new Map<string, MatchDecision>();
 for (const d of decisions) {
  const previous = byFixture.get(d.fixtureId);
  if (previous && (previous.winnerId !== d.winnerId || [...new Set(previous.confirmedBy)].sort().join("|") !== [...new Set(d.confirmedBy)].sort().join("|"))) {
   throw new Error("Conflicting results for fixture");
  }
  byFixture.set(d.fixtureId, d);
 }
 const winners: string[] = [];
 for (const fixture of fixtures) {
  if (fixture.bye) { winners.push(fixture.playerA); continue; }
  const result = byFixture.get(fixture.id);
  if (!result) throw new Error("Missing confirmed result");
  const check = validateMatchDecision(fixture, result);
  if (!check.ok) throw new Error(check.reason);
  winners.push(result.winnerId);
 }
 if (byFixture.size !== fixtures.filter(f => !f.bye).length) throw new Error("Unknown fixture result");
 return winners;
}
