import { describe, it, expect } from "vitest";
import { validateProfile, validateHealth, validatePasswordChange, hasErrors, normalizePhone } from "./profileValidation";

describe("validatePasswordChange", () => {
  const ok = { current: "OldPass1", newPass: "NewPass123", confirm: "NewPass123" };

  it("accepts a valid change", () => {
    expect(validatePasswordChange(ok)).toEqual({});
  });

  it("requires all fields", () => {
    const e = validatePasswordChange({ current: "", newPass: "", confirm: "" });
    expect(Object.keys(e).sort()).toEqual(["confirm", "current", "newPass"]);
  });

  it("enforces strength rules", () => {
    expect(validatePasswordChange({ ...ok, newPass: "Ab1", confirm: "Ab1" }).newPass).toMatch(/8 characters/);
    expect(validatePasswordChange({ ...ok, newPass: "alllowercase1", confirm: "alllowercase1" }).newPass).toBeDefined();
  });

  it("rejects reusing the current password and mismatched confirmation", () => {
    expect(validatePasswordChange({ current: "SamePass1", newPass: "SamePass1", confirm: "SamePass1" }).newPass).toBeDefined();
    expect(validatePasswordChange({ ...ok, confirm: "Different1" }).confirm).toMatch(/match/);
  });
});

describe("validateProfile", () => {
  it("accepts a valid profile", () => {
    expect(validateProfile({ fullName: "Nimal Perera", phone: "077 123 4567", address: "Colombo" })).toEqual({});
  });

  it("requires a name", () => {
    expect(validateProfile({ fullName: "  " }).fullName).toMatch(/required/);
  });

  it("rejects too-short and too-long names", () => {
    expect(validateProfile({ fullName: "A" }).fullName).toBeDefined();
    expect(validateProfile({ fullName: "x".repeat(61) }).fullName).toBeDefined();
  });

  it("allows an empty phone but rejects malformed ones", () => {
    expect(validateProfile({ fullName: "Nimal", phone: "" }).phone).toBeUndefined();
    expect(validateProfile({ fullName: "Nimal", phone: "+94771234567" }).phone).toBeUndefined();
    expect(validateProfile({ fullName: "Nimal", phone: "12345" }).phone).toBeDefined();
  });

  it("limits address length", () => {
    expect(validateProfile({ fullName: "Nimal", address: "a".repeat(201) }).address).toBeDefined();
  });
});

describe("validateHealth", () => {
  it("accepts empty health info", () => {
    expect(validateHealth({})).toEqual({});
  });

  it("rejects a future date of birth", () => {
    const future = new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10);
    expect(validateHealth({ dob: future }).dob).toBeDefined();
  });

  it("limits free-text length", () => {
    expect(validateHealth({ allergies: "x".repeat(301) }).allergies).toBeDefined();
  });
});

describe("helpers", () => {
  it("hasErrors / normalizePhone", () => {
    expect(hasErrors({})).toBe(false);
    expect(hasErrors({ a: "b" })).toBe(true);
    expect(normalizePhone("077-123 4567")).toBe("0771234567");
  });
});
