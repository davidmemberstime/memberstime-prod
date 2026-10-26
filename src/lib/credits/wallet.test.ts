import { HOST_REWARD_PER_ROUND, MONTHLY_HOST_EARNING_CAP, VISITOR_COST_PER_PERSON, summarizeCreditWallet } from "./wallet";

// Dependency-free assertions for a future test runner. Not executed in production.
function check(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

export function runCreditWalletChecks() {
  check(HOST_REWARD_PER_ROUND === 1.5, "Host earns 1.5 credits");
  check(VISITOR_COST_PER_PERSON === 1, "Each visitor spends one credit");
  check(MONTHLY_HOST_EARNING_CAP === 6, "Monthly earning cap is six");
  const entry = [{ amount: 1.5, created_at: "2026-10-01", expires_at: null }];
  const held = summarizeCreditWallet(entry, [{ credits: 1, status: "held", expiry_protected_until: null }]);
  check(held.available === 0.5 && held.held === 1, "Booking holds one credit");
  const released = summarizeCreditWallet(entry, [{ credits: 1, status: "released", expiry_protected_until: "2026-12-01" }], new Date("2026-11-01"));
  check(released.available === 1.5 && released.held === 0, "Host cancellation releases credit");
  check(released.protectedUntil === "2026-12-01", "Expiry protection retained");
  const pair = summarizeCreditWallet([{ amount: 3, created_at: "2026-10-01", expires_at: null }], [
    { credits: 1, status: "held", expiry_protected_until: null },
    { credits: 1, status: "held", expiry_protected_until: null },
  ]);
  check(pair.held === 2 && pair.available === 1, "Pair holds two visitor credits");
  const expired = summarizeCreditWallet([{ amount: 1.5, created_at: "2026-01-01", expires_at: "2026-02-01" }], [], new Date("2026-10-26"));
  check(expired.available === 0, "Expired credit not available");
}
