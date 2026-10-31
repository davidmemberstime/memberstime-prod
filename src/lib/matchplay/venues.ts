export type VenueStatus = "preferred_unconfirmed" | "quoted" | "contracted";
export type ChampionshipVenue = {
 competition: string;
 name: string;
 location: string;
 status: VenueStatus;
 targetMinGbp: number;
 targetMaxGbp: number;
 estimatedPlayers: number;
 contactEmail: string;
 contactPhone: string;
 note: string;
};
export const englandFinalVenue: ChampionshipVenue = {
 competition: "England National Match Play Final",
 name: "Sutton Coldfield Golf Club",
 location: "Streetly, Sutton Coldfield, West Midlands",
 status: "preferred_unconfirmed",
 targetMinGbp: 50,
 targetMaxGbp: 80,
 estimatedPlayers: 32,
 contactEmail: "manager@suttoncoldfieldgc.com",
 contactPhone: "0121 353 9633",
 note: "Preferred venue only. No booking, price or partnership has been agreed.",
};
export const englandFinalBudget = {
 minimumGolfOnlyGbp: englandFinalVenue.estimatedPlayers * englandFinalVenue.targetMinGbp,
 maximumGolfOnlyGbp: englandFinalVenue.estimatedPlayers * englandFinalVenue.targetMaxGbp,
};
