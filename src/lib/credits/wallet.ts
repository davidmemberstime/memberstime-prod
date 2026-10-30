export type CreditLedgerEntry = {
  amount: number;
  expires_at: string | null;
  created_at: string;
};

export type CreditReservation = {
  credits: number;
  status: "held" | "released" | "settled";
  expiry_protected_until: string | null;
};

export type WalletSummary = {
  earned: number;
  spent: number;
  held: number;
  available: number;
  protectedUntil: string | null;
};

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * A read-only display summary, NOT an authorization or settlement calculation.
 * The trusted booking transaction must enforce available funds, expiry, and
 * the six-credit monthly earning limit atomically in the database.
 */
export function summarizeCreditWallet(
  ledger: CreditLedgerEntry[],
  reservations: CreditReservation[],
  asOf: Date = new Date()
): WalletSummary {
  const now = asOf.getTime();
  const earned = round(ledger.filter(e => e.amount > 0).reduce((sum, e) => sum + e.amount, 0));
  const spent = round(-ledger.filter(e => e.amount < 0).reduce((sum, e) => sum + e.amount, 0));
  const held = round(reservations.filter(r => r.status === "held").reduce((sum, r) => sum + r.credits, 0));
  const activeLedger = ledger.filter(e => !e.expires_at || Date.parse(e.expires_at) > now);
  const activeBalance = round(activeLedger.reduce((sum, e) => sum + e.amount, 0));
  const protectedDates = reservations
    .filter(r => r.status === "released" && r.expiry_protected_until && Date.parse(r.expiry_protected_until) > now)
    .map(r => r.expiry_protected_until as string)
    .sort();
  return {
    earned,
    spent,
    held,
    available: Math.max(0, round(activeBalance - held)),
    protectedUntil: protectedDates.at(-1) ?? null,
  };
}

export const HOST_REWARD_PER_ROUND = 1.5;
export const VISITOR_COST_PER_PERSON = 1;
export const MONTHLY_HOST_EARNING_CAP = 6;
export const MAX_VISITORS_PER_ROUND = 2;
