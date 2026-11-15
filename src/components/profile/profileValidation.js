// Pure validation helpers for the customer profile forms.
// Each validator returns an object of { fieldName: "error message" };
// an empty object means the input is valid.

// Sri Lankan mobile / landline: 0XXXXXXXXX or +94XXXXXXXXX (spaces and dashes allowed)
const LK_PHONE = /^(?:\+94|0)\d{9}$/;

export const normalizePhone = (phone) => (phone || "").replace(/[\s-]/g, "");

export function validateProfile({ fullName, phone, address }) {
  const errors = {};
  const name = (fullName || "").trim();

  if (!name) errors.fullName = "Full name is required.";
  else if (name.length < 2) errors.fullName = "Name must be at least 2 characters.";
  else if (name.length > 60) errors.fullName = "Name must be 60 characters or fewer.";

  const p = normalizePhone(phone);
  if (p && !LK_PHONE.test(p)) errors.phone = "Use 07XXXXXXXX or +947XXXXXXXX.";

  if ((address || "").trim().length > 200) errors.address = "Address must be 200 characters or fewer.";

  return errors;
}

export function validateHealth({ dob, allergies, chronicConditions }) {
  const errors = {};

  if (dob) {
    const d = new Date(dob);
    const now = new Date();
    if (Number.isNaN(d.getTime())) errors.dob = "Enter a valid date.";
    else if (d > now) errors.dob = "Date of birth cannot be in the future.";
    else if (now.getFullYear() - d.getFullYear() > 120) errors.dob = "Enter a realistic date of birth.";
  }

  if ((allergies || "").length > 300) errors.allergies = "Keep allergies under 300 characters.";
  if ((chronicConditions || "").length > 300) errors.chronicConditions = "Keep conditions under 300 characters.";

  return errors;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;
