import { planRegionalFirstRound, validateMatchDecision, nextRoundCandidates } from "./bracket";

function assert(condition: boolean, label: string) { if (!condition) throw new Error(label); }
function throws(fn: () => unknown, label: string) { let failed = false; try { fn(); } catch { failed = true; } assert(failed, label); }
const entries = [{id:"z",region:"South"},{id:"a",region:"South"},{id:"b",region:"South"},{id:"c",region:"North"},{id:"d",region:"North"}];
const first = planRegionalFirstRound(entries);
assert(JSON.stringify(first) === JSON.stringify(planRegionalFirstRound([...entries].reverse())), "Draw must not depend on input ordering");
assert(first.length === 3, "Two North and three South entrants yield three fixtures");
assert(first.filter(f => f.bye).length === 1, "One bye expected");
throws(() => planRegionalFirstRound([{id:"a",region:"South"},{id:"a",region:"North"}]), "Duplicate entrants rejected");
const match = first.find(f => !f.bye)!;
const accepted = {fixtureId:match.id,winnerId:match.playerA,confirmedBy:[match.playerA,match.playerB!]};
assert(validateMatchDecision(match,accepted).ok, "Mutual confirmation accepted");
assert(!validateMatchDecision(match,{...accepted,confirmedBy:[match.playerA,match.playerA]}).ok,"Self confirmation rejected");
assert(!validateMatchDecision(match,{...accepted,winnerId:"outsider"}).ok,"Outsider winner rejected");
const results = first.filter(f => !f.bye).map(f => ({fixtureId:f.id,winnerId:f.playerA,confirmedBy:[f.playerA,f.playerB!]}));
const winners = nextRoundCandidates(first,results);
assert(winners.length === 3, "All winners and bye advance");
assert(JSON.stringify(winners) === JSON.stringify(nextRoundCandidates(first,results)), "Advancement deterministic");
throws(() => nextRoundCandidates(first,results.slice(1)), "Incomplete round rejected");
throws(() => nextRoundCandidates(first,[...results,{...results[0],winnerId:results[0].confirmedBy[1]}]), "Conflicting duplicate rejected");
