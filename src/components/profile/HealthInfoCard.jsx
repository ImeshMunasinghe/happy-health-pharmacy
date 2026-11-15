import { useState } from "react";
import {
  HeartPulse, Lock, Eye, EyeOff, Edit2, Save, X,
  Calendar, Droplet, AlertTriangle, Activity,
} from "lucide-react";
import { C, FONT, inputStyle } from "./profileTheme";
import { getHealthInfo, saveHealthInfo } from "../../services/customerProfileService";
import { validateHealth, hasErrors } from "./profileValidation";

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EMPTY = { dob: "", bloodGroup: "", allergies: "", chronicConditions: "", shareWithPharmacist: false };

function Row({ icon, label, value }) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-[10px]" style={{ border: `1px solid ${C.border}` }}>
      <div className="w-[34px] h-[34px] rounded-lg shrink-0 flex items-center justify-center" style={{ background: C.accentFaint }}>
        <Icon size={15} color={C.accent} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: C.textMuted }}>{label}</p>
        <p className="text-[13px] font-semibold mt-[2px] break-words" style={{ color: C.textPrimary }}>{value || "Not provided"}</p>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: C.textMuted }}>{label}</label>
      {children}
      {error && <p role="alert" className="text-[11px] font-semibold" style={{ color: C.dangerText }}>{error}</p>}
    </div>
  );
}

// ── HealthInfoCard ────────────────────────────────────────────────────────────
// Optional, sensitive health information. Stored in users/{uid}/private/health,
// which has stricter security rules than the main profile document.
// Data is not fetched until the customer explicitly chooses "Show", so it is
// never on screen by default (e.g. on a shared computer).
export default function HealthInfoCard({ uid, onToast }) {
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saved, setSaved]       = useState(EMPTY);   // last persisted values
  const [form, setForm]         = useState(EMPTY);   // editable copy
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  const errors  = validateHealth(form);
  const isDirty = JSON.stringify(form) !== JSON.stringify(saved);

  const reveal = async () => {
    setRevealed(true);
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getHealthInfo(uid);
      const merged = { ...EMPTY, ...(data || {}) };
      delete merged.updatedAt;
      setSaved(merged);
      setForm(merged);
    } catch (err) {
      console.error("Failed to load health info:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const hide = () => { setRevealed(false); setEditing(false); setForm(saved); };

  const handleSave = async () => {
    if (hasErrors(errors)) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        allergies: form.allergies.trim(),
        chronicConditions: form.chronicConditions.trim(),
      };
      await saveHealthInfo(uid, payload);
      setSaved(payload);
      setForm(payload);
      setEditing(false);
      onToast?.("Health information saved.");
    } catch (err) {
      console.error("Failed to save health info:", err);
      onToast?.("Failed to save health information.", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const btn = (extra = {}) => ({
    className: "flex items-center gap-[5px] text-[12px] font-semibold px-3 py-[6px] rounded-lg cursor-pointer",
    style: { color: C.accent, background: C.accentFaint, border: `1px solid ${C.border}`, fontFamily: FONT.body, ...extra },
  });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
      {/* Header */}
      <div className="px-5 py-[14px] flex flex-wrap gap-2 justify-between items-center" style={{ background: C.accentFaint, borderBottom: `1px solid ${C.border}` }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-[6px]" style={{ color: C.textMuted }}>
          <HeartPulse size={12} color={C.accent} /> Health Information
          <span className="normal-case tracking-normal font-semibold" style={{ color: C.textMuted }}>(optional)</span>
        </p>

        <div className="flex gap-2">
          {!revealed && (
            <button onClick={reveal} {...btn()}><Eye size={12} /> Show</button>
          )}
          {revealed && !editing && !loading && !loadError && (
            <>
              <button onClick={hide} {...btn({ color: C.textMuted })}><EyeOff size={12} /> Hide</button>
              <button onClick={() => setEditing(true)} {...btn()}><Edit2 size={12} /> Edit</button>
            </>
          )}
          {editing && (
            <>
              <button onClick={() => { setEditing(false); setForm(saved); }} {...btn({ color: C.textMuted })}><X size={12} /> Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !isDirty || hasErrors(errors)}
                {...btn({
                  color: "#fff",
                  background: saving || !isDirty || hasErrors(errors) ? "#9CC4B0" : C.accent,
                  cursor: saving || !isDirty || hasErrors(errors) ? "not-allowed" : "pointer",
                  border: "none",
                })}
              >
                <Save size={12} /> {saving ? "Saving…" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-[18px] flex flex-col gap-[14px]">
        <p className="text-[12px] flex items-start gap-2" style={{ color: C.textMuted }}>
          <Lock size={13} className="shrink-0 mt-[2px]" color={C.accent} />
          Only you can see this. Pharmacists can view it only if you allow sharing below,
          to help check for drug interactions and allergies.
        </p>

        {revealed && loading && (
          <p className="text-[13px]" style={{ color: C.textMuted }}>Loading…</p>
        )}

        {revealed && loadError && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px]" style={{ color: C.dangerText }}>Couldn't load health information.</p>
            <button onClick={reveal} {...btn()}>Retry</button>
          </div>
        )}

        {revealed && !loading && !loadError && !editing && (
          <div className="flex flex-col gap-[10px]">
            <Row icon={Calendar}      label="Date of Birth"       value={saved.dob} />
            <Row icon={Droplet}       label="Blood Group"         value={saved.bloodGroup} />
            <Row icon={AlertTriangle} label="Allergies"           value={saved.allergies} />
            <Row icon={Activity}      label="Chronic Conditions"  value={saved.chronicConditions} />
            <p className="text-[12px] font-semibold" style={{ color: saved.shareWithPharmacist ? C.accent : C.textMuted }}>
              {saved.shareWithPharmacist ? "✓ Shared with Happy Health pharmacists" : "Not shared with pharmacists"}
            </p>
          </div>
        )}

        {editing && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              <Field label="Date of Birth" error={errors.dob}>
                <input type="date" style={inputStyle} value={form.dob} onChange={set("dob")} max={new Date().toISOString().slice(0, 10)} />
              </Field>
              <Field label="Blood Group">
                <select style={inputStyle} value={form.bloodGroup} onChange={set("bloodGroup")}>
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g || "Select…"}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Allergies" error={errors.allergies}>
              <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.allergies} onChange={set("allergies")} placeholder="e.g. Penicillin, peanuts" />
            </Field>
            <Field label="Chronic Conditions" error={errors.chronicConditions}>
              <textarea rows={2} style={{ ...inputStyle, resize: "vertical" }} value={form.chronicConditions} onChange={set("chronicConditions")} placeholder="e.g. Hypertension, Type 2 diabetes" />
            </Field>
            <label className="flex items-start gap-2 text-[13px] cursor-pointer" style={{ color: C.textPrimary }}>
              <input type="checkbox" className="mt-[3px]" checked={form.shareWithPharmacist} onChange={set("shareWithPharmacist")} style={{ accentColor: C.accent }} />
              Allow Happy Health pharmacists to view this information when reviewing my prescriptions.
            </label>
          </>
        )}
      </div>
    </div>
  );
}
