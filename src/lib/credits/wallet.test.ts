import { describe, expect, it } from "vitest";
import {
  HOST_REWARD_PER_ROUND,
  MONTHLY_HOST_EARNING_CAP,
  VISITOR_COST_PER_PERSON,
  summarizeCreditWallet,
} from "./wallet";

describe("Give & Play credit policy", () => {
  it("awards a fixed 1.5 credits per round regardless of one or two visitors", () => {
    expect(HOST_REWARD_PER_ROUND).toBe(1.5);
    expect(VISITOR_COST_PER_PERSON).toBe(1);
    expect(MONTHLY_HOST_EARNING_CAP).toBe(6);
    expect(HOST_REWARD_PER_ROUND * 4).toBe(MONTHLY_HOST_EARNING_CAP);
  });

  it("holds one visitor credit without spending it", () => {
    const wallet = summarizeCreditWallet(
      [{ amount: 1.5, created_at: "2026-10-01", expires_at: null }],
      [{ credits: 1, status: "held", expiry_protected_until: null }]
    );
    expect(wallet.available).toBe(0.5);
    expect(wallet.held).toBe(1);
  });

  it("releases a cancelled visitor's hold", () => {
    const wallet = summarizeCreditWallet(
      [{ amount: 1.5, created_at: "2026-10-01", expires_at: null }],
      [{ credits: 1, status: "released", expiry_protected_until: "2026-12-01" }],
      new Date("2026-11-01")
    );
    expect(wallet.available).toBe(1.5);
    expect(wallet.held).toBe(0);
    expect(wallet.protectedUntil).toBe("2026-12-01");
  });

  it("holds two credits for two distinct visitors", () => {
    const wallet = summarizeCreditWallet(
      [{ amount: 3, created_at: "2026-10-01", expires_at: null }],
      [
        { credits: 1, status: "held", expiry_protected_until: null },
        { credits: 1, status: "held", expiry_protected_until: null },
      ]
    );
    expect(wallet.held).toBe(2);
    expect(wallet.available).toBe(1);
  });

  it("does not show an expired positive credit as available", () => {
    const wallet = summarizeCreditWallet(
      [{ amount: 1.5, created_at: "2026-01-01", expires_at: "2026-02-01" }],
      [],
      new Date("2026-10-26")
    );
    expect(wallet.available).toBe(0);
  });
});
