// src/services/customerProfileService.js
// Firestore / Storage data layer for the customer profile page.
// Replaces the old REST calls to GET/PUT /api/profile/:uid, so the page works
// without the external backend.
//
// Data layout
//   users/{uid}                    – public-ish profile (name, phone, address, photo, loyalty)
//   users/{uid}/private/health     – sensitive health info, separate doc so it can have
//                                    stricter security rules (see firestore.profile.rules)
//   CustomerOrders (email == …)    – shop orders, matched by email (no userId on these docs)
//   prescriptions  (userId == …)   – prescription uploads

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { COLLECTIONS, PROFILE_PICTURE_PATH } from "../components/utils/constants";

// Only these fields may be changed by the customer from the profile page.
// Loyalty, role, customerId, email etc. are deliberately excluded.
const EDITABLE_PROFILE_FIELDS = ["fullName", "phone", "address", "photoURL"];
const EDITABLE_HEALTH_FIELDS  = ["dob", "bloodGroup", "allergies", "chronicConditions", "shareWithPharmacist"];

const pick = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

// Firestore Timestamp | ISO string | Date | { seconds } → Date (or null)
export const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

// ── Profile ───────────────────────────────────────────────────────────────────

export async function getProfile(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateProfile(uid, fields) {
  const safe = pick(fields, EDITABLE_PROFILE_FIELDS);
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    ...safe,
    updatedAt: serverTimestamp(),
  });
  return safe;
}

export async function uploadProfilePhoto(uid, file) {
  const storageRef = ref(storage, PROFILE_PICTURE_PATH(uid));
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  await updateProfile(uid, { photoURL: url });
  return url;
}

// ── Health information (sensitive) ────────────────────────────────────────────

const healthRef = (uid) => doc(db, COLLECTIONS.USERS, uid, "private", "health");

export async function getHealthInfo(uid) {
  const snap = await getDoc(healthRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveHealthInfo(uid, fields) {
  const safe = pick(fields, EDITABLE_HEALTH_FIELDS);
  await setDoc(healthRef(uid), { ...safe, updatedAt: serverTimestamp() }, { merge: true });
  return safe;
}

// ── Recent activity ───────────────────────────────────────────────────────────
// Queries use a single equality filter and are sorted client-side, so no
// composite Firestore index is required. A customer's own history is small.

const newestFirst = (a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0);

export async function getRecentOrders(email, max = 3) {
  if (!email) return [];
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.CUSTOMER_ORDERS), where("email", "==", email))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst).slice(0, max);
}

// Total number of orders for the demo loyalty rule: shop orders (by email) plus
// prescription orders (by uid). Uses count aggregation, so no documents are downloaded.
export async function getOrderCount(uid, email) {
  const [orders, prescriptions] = await Promise.all([
    email
      ? getCountFromServer(query(collection(db, COLLECTIONS.CUSTOMER_ORDERS), where("email", "==", email)))
      : null,
    getCountFromServer(query(collection(db, COLLECTIONS.PRESCRIPTIONS), where("userId", "==", uid))),
  ]);
  return (orders?.data().count || 0) + (prescriptions.data().count || 0);
}

export async function getRecentPrescriptions(uid, max = 3) {
  const snap = await getDocs(
    query(collection(db, COLLECTIONS.PRESCRIPTIONS), where("userId", "==", uid))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort(newestFirst).slice(0, max);
}
