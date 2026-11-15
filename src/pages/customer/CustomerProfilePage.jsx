import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, AlertCircle, RefreshCw } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getOrderCount,
} from "../../services/customerProfileService";
import { resolveLoyaltyPoints } from "../../components/profile/loyalty";

import { C, FONT } from "../../components/profile/profileTheme";
import ProfileHero    from "../../components/profile/ProfileHero";
import LoyaltyCard    from "../../components/profile/LoyaltyCard";
import ProfileDetails from "../../components/profile/ProfileDetails";
import RecentActivity from "../../components/profile/RecentActivity";
import HealthInfoCard from "../../components/profile/HealthInfoCard";
import QuickLinks     from "../../components/profile/QuickLinks";
import { Toast }      from "../../components/profile/ProfileUI";
import { validateProfile, hasErrors, normalizePhone } from "../../components/profile/profileValidation";

import {
  TOAST_DURATION_MS,
  MAX_PHOTO_SIZE_MB,
  MAX_PHOTO_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ROUTES,
} from "../../components/utils/constants";

// Full-height centred message used for loading / error / not-found states.
function StateMessage({ children }) {
  return (
    <div
      className="flex flex-col gap-3 justify-center items-center min-h-[60vh] px-4 text-center text-[14px]"
      style={{ color: C.textMuted, fontFamily: FONT.body, background: C.bg }}
    >
      {children}
    </div>
  );
}

export default function CustomerProfilePage() {
  const navigate = useNavigate();
  // AuthProvider only renders children once Firebase has restored the session,
  // so currentUser is reliable here (unlike getAuth().currentUser on a refresh).
  const { currentUser, logout } = useAuth();

  const [user, setUser]                     = useState(null);
  const [status, setStatus]                 = useState("loading"); // loading | ready | error | notfound
  const [editing, setEditing]               = useState(false);
  const [saving, setSaving]                 = useState(false);
  const [toast, setToast]                   = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const toastTimer = useRef(null);

  // Editable fields — kept separate so Cancel can restore the saved values
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");

  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const resetForm = (u) => {
    setFullName(u?.fullName || "");
    setPhone(u?.phone || "");
    setAddress(u?.address || "");
  };

  // ── Load profile from Firestore users/{uid} ────────────────────────────────
  const loadProfile = useCallback(async () => {
    if (!currentUser) { navigate(ROUTES.LOGIN); return; }
    setStatus("loading");
    try {
      const data = await getProfile(currentUser.uid);
      if (!data) { setStatus("notfound"); return; }

      const mapped = {
        ...data,
        email: data.email || currentUser.email,
        // LoyaltyCard reads these; never derive points from totalSpent.
        totalPoints: data.loyaltyPoints ?? 0,
        level: data.loyaltyTier ?? data.level ?? "Silver",
      };
      setUser(mapped);
      resetForm(mapped);
      setStatus("ready");
    } catch (err) {
      console.error("Failed to load profile:", err);
      setStatus("error");
    }
  }, [currentUser, navigate]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // ── Demo loyalty points (display only, never saved) ────────────────────────
  // Once the profile is loaded, count the customer's orders and apply the demo
  // rule — but only when no real loyaltyPoints are stored on the profile.
  const profileUid   = user?.id;
  const profileEmail = user?.email;
  const storedPoints = user?.loyaltyPoints;
  useEffect(() => {
    if (!profileUid) return;
    let active = true;
    getOrderCount(profileUid, profileEmail)
      .then((count) => {
        if (!active) return;
        const { points } = resolveLoyaltyPoints(storedPoints, count);
        setUser((prev) => prev && ({ ...prev, totalPoints: points }));
      })
      .catch((err) => console.error("Failed to count orders for loyalty:", err));
    return () => { active = false; };
  }, [profileUid, profileEmail, storedPoints]);

  // ── Validation / dirty tracking ────────────────────────────────────────────
  const errors  = validateProfile({ fullName, phone, address });
  const isDirty = !!user && (
    fullName.trim() !== (user.fullName || "") ||
    normalizePhone(phone) !== normalizePhone(user.phone) ||
    address.trim() !== (user.address || "")
  );

  // ── Save name / phone / address ────────────────────────────────────────────
  const handleSave = async () => {
    if (!user || hasErrors(errors) || !isDirty) return;
    setSaving(true);
    try {
      const fields = {
        fullName: fullName.trim(),
        phone:    normalizePhone(phone),
        address:  address.trim(),
      };
      await updateProfile(user.id, fields);
      const next = { ...user, ...fields };
      setUser(next);
      resetForm(next);
      setEditing(false);
      // Keep the navbar greeting in sync (AuthContext stores this at login).
      try { sessionStorage.setItem("userName", fields.fullName); } catch { /* ignore */ }
      showToast("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Profile photo ──────────────────────────────────────────────────────────
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file || !user) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showToast("Please select a valid image (JPG, PNG, WEBP, GIF).", "error");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      showToast(`Image must be smaller than ${MAX_PHOTO_SIZE_MB} MB.`, "error");
      return;
    }

    setUploadingPhoto(true);
    try {
      const url = await uploadProfilePhoto(user.id, file);
      setUser((prev) => ({ ...prev, photoURL: url }));
      showToast("Profile picture updated!");
    } catch (err) {
      console.error("Failed to upload photo:", err);
      showToast("Failed to upload photo.", "error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch {
      showToast("Logout failed.", "error");
    }
  };

  // ── Non-ready states ───────────────────────────────────────────────────────
  if (status === "loading") return <StateMessage>Loading profile…</StateMessage>;

  if (status === "error") return (
    <StateMessage>
      <AlertCircle size={28} color={C.dangerText} />
      <p>We couldn't load your profile. Please check your connection and try again.</p>
      <button
        onClick={loadProfile}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white cursor-pointer border-none"
        style={{ background: C.accent, fontFamily: FONT.body }}
      >
        <RefreshCw size={14} /> Retry
      </button>
    </StateMessage>
  );

  if (status === "notfound") return (
    <StateMessage>
      <AlertCircle size={28} color={C.gold} />
      <p>No customer profile is linked to this account yet. Please contact the pharmacy for help.</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer"
        style={{ color: C.dangerText, background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, fontFamily: FONT.body }}
      >
        Log out
      </button>
    </StateMessage>
  );

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: FONT.body }}>
      <Toast toast={toast} />

      {/* Green hero with identity block; loyalty card sits inside it */}
      <ProfileHero user={user} uploading={uploadingPhoto} onPhotoChange={handlePhotoChange}>
        <LoyaltyCard user={user} />
      </ProfileHero>

      {/* Two columns on large screens; single stacked column on phones/tablets.
          Mobile order: details → quick links → activity → health → logout.
          Logout spans all 12 columns so it always sits below both columns. */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">

        {/* ── Left column: account details ── */}
        <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
        <ProfileDetails
          user={user}
          editing={editing}
          saving={saving}
          errors={editing ? errors : {}}
          canSave={isDirty && !hasErrors(errors)}
          fullName={fullName}
          phone={phone}
          address={address}
          onFullNameChange={setFullName}
          onPhoneChange={setPhone}
          onAddressChange={setAddress}
          onEdit={() => setEditing(true)}
          onCancel={() => { setEditing(false); resetForm(user); }}
          onSave={handleSave}
        />

        <QuickLinks />
        </div>

        {/* ── Right column: activity and health information ── */}
        <div className="lg:col-span-7 flex flex-col gap-5 min-w-0">
        <RecentActivity uid={user.id} email={user.email} />

        <HealthInfoCard uid={user.id} onToast={showToast} />
        </div>

        {/* ── Logout: full width, below all page content ── */}
        <button
          onClick={handleLogout}
          className="lg:col-span-12 flex items-center justify-center gap-2 w-full py-[13px] rounded-xl text-[14px] font-bold cursor-pointer"
          style={{
            background: C.dangerBg,
            color:      C.dangerText,
            border:     `1.5px solid ${C.dangerBorder}`,
            fontFamily: FONT.body,
          }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  );
}
