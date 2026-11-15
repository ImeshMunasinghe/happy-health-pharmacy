import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Palette, Sun, Moon, Bell, Mail, MessageSquare, Package, FileText, Gift,
  Lock, Eye, EyeOff, KeyRound, ShieldCheck, ChevronRight, RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  getPreferences,
  updatePreferences,
  DEFAULT_PREFERENCES,
  hasPasswordLogin,
  changePassword,
  passwordErrorMessage,
} from "../../services/customerProfileService";

import { C, FONT, inputStyle } from "../../components/profile/profileTheme";
import { Toast } from "../../components/profile/ProfileUI";
import { validatePasswordChange, hasErrors } from "../../components/profile/profileValidation";
import { TOAST_DURATION_MS } from "../../components/utils/constants";

// ── Small building blocks ─────────────────────────────────────────────────────

// Card for this page. Light mode is identical to the shared SectionCard
// (light-green header, dark title). In dark mode the header switches to the
// brand dark green with a white title, because the shared card's fixed light
// header made the (light) dark-mode title invisible. Only reads the existing
// theme flag; the theme configuration and shared SectionCard are unchanged.
function SettingsCard({ icon: iconEl, title, subtitle, children }) {
  const { isDarkMode } = useTheme();
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}
    >
      <div
        className="flex items-center gap-2.5 px-[22px] py-4"
        style={{
          background:   isDarkMode ? C.accentDark : C.accentFaint,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
          style={{ background: isDarkMode ? "rgba(255,255,255,0.12)" : C.accentFaint }}
        >
          {iconEl}
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: isDarkMode ? "#FFFFFF" : C.textPrimary }}>
            {title}
          </p>
          <p className="text-[11px]" style={{ color: isDarkMode ? "rgba(255,255,255,0.75)" : C.textMuted }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-[22px] flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

// Header icon: brand green on the light header, white on the dark header.
function CardIcon({ icon }) {
  const { isDarkMode } = useTheme();
  const Icon = icon;
  return <Icon size={16} color={isDarkMode ? "#FFFFFF" : C.accent} />;
}

// Accessible on/off switch
function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative w-[42px] h-[24px] rounded-full shrink-0 transition-colors duration-150 border-none"
      style={{
        background: checked ? C.accent : "#CBD5E1",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-150"
        style={{ left: checked ? 21 : 3 }}
      />
    </button>
  );
}

// One labelled preference row with a switch on the right
function ToggleRow({ icon, title, description, checked, onChange, disabled }) {
  const Icon = icon;
  return (
    <div className="flex items-center gap-3 py-[10px]">
      <div className="w-[34px] h-[34px] rounded-lg shrink-0 flex items-center justify-center" style={{ background: C.accentFaint }}>
        <Icon size={15} color={C.accent} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold" style={{ color: C.textPrimary }}>{title}</p>
        <p className="text-[11px] mt-[2px]" style={{ color: C.textMuted }}>{description}</p>
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} label={title} />
    </div>
  );
}

// Password input with show/hide toggle and inline error
function PasswordField({ label, name, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={name} className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: C.textMuted }}>{label}</label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{ ...inputStyle, paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer"
          style={{ color: C.textMuted }}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p role="alert" className="text-[11px] font-semibold" style={{ color: C.dangerText }}>{error}</p>}
    </div>
  );
}

const SubHeading = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.08em] pt-2" style={{ color: C.textMuted }}>{children}</p>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const EMPTY_PASSWORDS = { current: "", newPass: "", confirm: "" };

export default function CustomerSettings() {
  const { currentUser, resetPassword } = useAuth();
  const { isDarkMode, toggleTheme }    = useTheme();

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const showToast = useCallback((msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // ── Notification preferences (auto-saved on each toggle) ───────────────────
  const [prefs, setPrefs]           = useState(DEFAULT_PREFERENCES);
  const [prefsStatus, setPrefsStatus] = useState("loading"); // loading | ready | error
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsReload, setPrefsReload] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    getPreferences(currentUser.uid)
      .then((p) => { if (active) { setPrefs(p); setPrefsStatus("ready"); } })
      .catch((err) => { console.error("Failed to load preferences:", err); if (active) setPrefsStatus("error"); });
    return () => { active = false; };
  }, [currentUser, prefsReload]);

  const setPref = async (key, value) => {
    const previous = prefs;
    const next = { ...prefs, [key]: value };
    setPrefs(next);            // optimistic
    setPrefsSaving(true);
    try {
      await updatePreferences(currentUser.uid, next);
      showToast("Preferences saved.");
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setPrefs(previous);      // revert
      showToast("Couldn't save preferences.", "error");
    } finally {
      setPrefsSaving(false);
    }
  };

  const noChannel = !prefs.emailNotifications && !prefs.smsNotifications;
  const prefsDisabled = prefsStatus !== "ready" || prefsSaving;

  // ── Password ───────────────────────────────────────────────────────────────
  const canChangePassword = hasPasswordLogin(currentUser);
  const [pw, setPw]                 = useState(EMPTY_PASSWORDS);
  const [pwTouched, setPwTouched]   = useState(false);
  const [pwSaving, setPwSaving]     = useState(false);
  const [resetSending, setResetSending] = useState(false);

  const pwErrors = validatePasswordChange(pw);
  const onPwChange = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwTouched(true);
    if (hasErrors(pwErrors)) return;
    setPwSaving(true);
    try {
      await changePassword(pw.current, pw.newPass);
      setPw(EMPTY_PASSWORDS);
      setPwTouched(false);
      showToast("Password changed successfully.");
    } catch (err) {
      console.error("Password change failed:", err);
      showToast(passwordErrorMessage(err), "error");
    } finally {
      setPwSaving(false);
    }
  };

  const handleSendReset = async () => {
    if (!currentUser?.email) return;
    setResetSending(true);
    try {
      await resetPassword(currentUser.email);
      showToast(`Reset link sent to ${currentUser.email}.`);
    } catch (err) {
      console.error("Reset email failed:", err);
      showToast("Couldn't send the reset email.", "error");
    } finally {
      setResetSending(false);
    }
  };

  const shownPwErrors = pwTouched ? pwErrors : {};

  // ── Render ─────────────────────────────────────────────────────────────────
  const themeOption = (dark, Icon, label) => {
    const selected = isDarkMode === dark;
    return (
      <button
        type="button"
        onClick={() => { if (!selected) toggleTheme(); }}
        aria-pressed={selected}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold cursor-pointer"
        style={{
          fontFamily: FONT.body,
          color: selected ? "#fff" : C.textPrimary,
          background: selected ? C.accent : C.surface,
          border: `1.5px solid ${selected ? C.accent : C.border}`,
        }}
      >
        <Icon size={16} /> {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: FONT.body }}>
      <Toast toast={toast} />

      {/* Compact banner for this page only — the shared PageBanner (used by
          Orders / Prescriptions) has fixed large spacing and is left unchanged. */}
      <div className="px-4 sm:px-6 py-7 text-center" style={{ background: C.bannerGradient }}>
        <h1 className="text-[28px] sm:text-[30px] font-bold text-white leading-tight" style={{ fontFamily: FONT.body }}>
          Account Settings
        </h1>
        <p className="text-[14px] mt-1" style={{ color: C.bannerSubtitle, fontFamily: FONT.body }}>
          Manage your appearance, notifications and account security.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Appearance */}
          <SettingsCard icon={<CardIcon icon={Palette} />} title="Appearance" subtitle="Choose how Happy Health looks on this device">
            <div className="flex gap-3">
              {themeOption(false, Sun, "Light")}
              {themeOption(true, Moon, "Dark")}
            </div>
          </SettingsCard>

          {/* Notifications */}
          <SettingsCard icon={<CardIcon icon={Bell} />} title="Notifications" subtitle="Saved automatically when you change a setting">
            {prefsStatus === "loading" && <p className="text-[13px]" style={{ color: C.textMuted }}>Loading preferences…</p>}

            {prefsStatus === "error" && (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px]" style={{ color: C.dangerText }}>Couldn't load your preferences.</p>
                <button
                  onClick={() => { setPrefsStatus("loading"); setPrefsReload((k) => k + 1); }}
                  className="flex items-center gap-1 text-[12px] font-semibold px-3 py-[6px] rounded-lg cursor-pointer"
                  style={{ color: C.accent, background: C.accentFaint, border: `1px solid ${C.border}`, fontFamily: FONT.body }}
                >
                  <RefreshCw size={12} /> Retry
                </button>
              </div>
            )}

            {prefsStatus === "ready" && (
              <div className="flex flex-col">
                <SubHeading>How we contact you</SubHeading>
                <ToggleRow icon={Mail} title="Email" description={currentUser?.email || "Your account email"}
                  checked={prefs.emailNotifications} onChange={(v) => setPref("emailNotifications", v)} disabled={prefsDisabled} />
                <ToggleRow icon={MessageSquare} title="SMS" description="Text messages to the phone number on your profile"
                  checked={prefs.smsNotifications} onChange={(v) => setPref("smsNotifications", v)} disabled={prefsDisabled} />

                <SubHeading>What we notify you about</SubHeading>
                {noChannel && (
                  <p className="text-[11px] font-semibold pt-1" style={{ color: C.gold }}>
                    Turn on Email or SMS to receive these notifications.
                  </p>
                )}
                <ToggleRow icon={Package} title="Order updates" description="Order confirmed, shipped, delivered"
                  checked={prefs.orderUpdates} onChange={(v) => setPref("orderUpdates", v)} disabled={prefsDisabled || noChannel} />
                <ToggleRow icon={FileText} title="Prescription status" description="Reviewed, ready for pickup, dispensed"
                  checked={prefs.prescriptionUpdates} onChange={(v) => setPref("prescriptionUpdates", v)} disabled={prefsDisabled || noChannel} />
                <ToggleRow icon={Gift} title="Offers & promotions" description="Discounts and loyalty rewards"
                  checked={prefs.promotions} onChange={(v) => setPref("promotions", v)} disabled={prefsDisabled || noChannel} />
              </div>
            )}
          </SettingsCard>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5 min-w-0">

          {/* Security */}
          <SettingsCard icon={<CardIcon icon={Lock} />} title="Password & Security" subtitle="Keep your account safe">
            {canChangePassword ? (
              <form onSubmit={handleChangePassword} className="flex flex-col gap-[14px]" noValidate>
                <PasswordField label="Current Password" name="current" value={pw.current} onChange={onPwChange}
                  error={shownPwErrors.current} autoComplete="current-password" />
                <PasswordField label="New Password" name="newPass" value={pw.newPass} onChange={onPwChange}
                  error={shownPwErrors.newPass} autoComplete="new-password" />
                <PasswordField label="Confirm New Password" name="confirm" value={pw.confirm} onChange={onPwChange}
                  error={shownPwErrors.confirm} autoComplete="new-password" />
                <p className="text-[11px]" style={{ color: C.textMuted }}>
                  At least 8 characters, with upper- and lower-case letters and a number.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSendReset}
                    disabled={resetSending}
                    className="text-[12px] font-semibold bg-transparent border-none cursor-pointer p-0"
                    style={{ color: C.accent, fontFamily: FONT.body, opacity: resetSending ? 0.6 : 1 }}
                  >
                    {resetSending ? "Sending…" : "Forgot current password? Email me a reset link"}
                  </button>
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="flex items-center gap-2 text-[13px] font-bold text-white px-5 py-[10px] rounded-xl border-none"
                    style={{
                      background: pwSaving ? "#9CC4B0" : C.accent,
                      cursor: pwSaving ? "not-allowed" : "pointer",
                      fontFamily: FONT.body,
                      boxShadow: C.btnShadow,
                    }}
                  >
                    <KeyRound size={14} /> {pwSaving ? "Updating…" : "Update Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} color={C.accent} className="shrink-0 mt-[2px]" />
                <p className="text-[13px]" style={{ color: C.textPrimary }}>
                  You sign in with Google, so there's no Happy Health password to change.
                  Manage your password and security in your Google account.
                </p>
              </div>
            )}
          </SettingsCard>

          {/* Privacy shortcut */}
          <SettingsCard icon={<CardIcon icon={ShieldCheck} />} title="Privacy" subtitle="Control who can see your information">
            <Link
              to="/customer/profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl no-underline"
              style={{ border: `1px solid ${C.border}` }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: C.textPrimary }}>Health information sharing</p>
                <p className="text-[11px] mt-[2px]" style={{ color: C.textMuted }}>
                  Choose whether pharmacists can see your allergies and conditions — managed on your profile.
                </p>
              </div>
              <ChevronRight size={15} color={C.textMuted} />
            </Link>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
