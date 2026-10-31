/** Only images with documented commercial reuse rights may be listed here. */
export type ClubImage = { src: string; alt: string; credit: string; licence: string; evidenceUrl: string; clubName: string };
export const APPROVED_CLUB_IMAGES: Record<string, ClubImage> = {};
/** Strict exact-name match prevents a similarly named course being misidentified. */
export function approvedClubImage(name: string): ClubImage | null {
 const key = name.trim().toLocaleLowerCase("en-GB");
 const match = APPROVED_CLUB_IMAGES[key];
 return match && match.clubName.trim().toLocaleLowerCase("en-GB") === key && match.src.startsWith("/club-images/") && !!match.licence && !!match.evidenceUrl ? match : null;
}
