// Demo loyalty rule — DISPLAY ONLY.
// Real points must be awarded by a trusted backend (see LoyaltyCard comments);
// these demo points are calculated in the browser and never written to Firestore.

export const DEMO_LOYALTY = {
  MIN_ORDERS: 2,  // "more than one order"
  POINTS:     5,
};

// Returns the demo points earned for a given number of orders.
export function computeDemoLoyaltyPoints(orderCount) {
  return orderCount >= DEMO_LOYALTY.MIN_ORDERS ? DEMO_LOYALTY.POINTS : 0;
}

// Real stored points win; demo points are only used when nothing is stored.
export function resolveLoyaltyPoints(storedPoints, orderCount) {
  if (typeof storedPoints === "number" && storedPoints > 0) {
    return { points: storedPoints, isDemo: false };
  }
  return { points: computeDemoLoyaltyPoints(orderCount), isDemo: true };
}
