import { describe, it, expect } from "vitest";
import { computeDemoLoyaltyPoints, resolveLoyaltyPoints } from "./loyalty";

describe("computeDemoLoyaltyPoints", () => {
  it("gives 0 points for zero or one order", () => {
    expect(computeDemoLoyaltyPoints(0)).toBe(0);
    expect(computeDemoLoyaltyPoints(1)).toBe(0);
  });

  it("gives 5 points for more than one order", () => {
    expect(computeDemoLoyaltyPoints(2)).toBe(5);
    expect(computeDemoLoyaltyPoints(10)).toBe(5);
  });
});

describe("resolveLoyaltyPoints", () => {
  it("prefers real stored points", () => {
    expect(resolveLoyaltyPoints(1200, 5)).toEqual({ points: 1200, isDemo: false });
  });

  it("falls back to demo points when nothing is stored", () => {
    expect(resolveLoyaltyPoints(undefined, 3)).toEqual({ points: 5, isDemo: true });
    expect(resolveLoyaltyPoints(0, 1)).toEqual({ points: 0, isDemo: true });
  });
});
