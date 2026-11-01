export type MatchStatus = "scheduled" | "awaiting_confirmation" | "completed";
export type MatchFixture = {
 id: string; round: number; region: string; playerA: string; playerB: string;
 deadline: string; status: MatchStatus; winner?: string;
};
export const competition = {
 title: "Members Time National Match Play Championship",
 year: 2027,
 format: "Singles knockout match play",
 status: "In preparation",
};
export const demoFixtures: MatchFixture[] = [
 {id:"demo-1",round:1,region:"South",playerA:"Member A",playerB:"Member B",deadline:"TBC",status:"scheduled"},
 {id:"demo-2",round:1,region:"North",playerA:"Member C",playerB:"Member D",deadline:"TBC",status:"awaiting_confirmation"},
 {id:"demo-3",round:1,region:"Midlands",playerA:"Member E",playerB:"Member F",deadline:"TBC",status:"completed",winner:"Member E"},
 {id:"demo-4",round:2,region:"South",playerA:"Winner of Match 1",playerB:"Winner of Match 2",deadline:"TBC",status:"scheduled"},
];
export const entryRequirements = [
 "Verified membership of an eligible golf club",
 "An official WHS handicap record, subject to verification arrangements",
 "Acceptance of the competition rules and match-play etiquette",
 "Availability to arrange fixtures before each published deadline",
];
