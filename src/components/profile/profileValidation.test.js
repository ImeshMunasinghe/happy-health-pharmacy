import { describe, it, expect } from "vitest";
import { validateProfile, validateHealth, hasErrors, normalizePhone } from "./profileValidation";

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
