import { useRef } from "react";
import { Camera } from "lucide-react";
import { C, FONT } from "./profileTheme";

// Small pill indicator for status / role, sized to sit under the email.
function Badge({ label, active }) {
  return (
    <span
      className="inline-flex items-center gap-[5px] text-[10px] font-bold px-[10px] py-[3px] rounded-full uppercase tracking-[0.08em]"
      style={{
        background: active ? "rgba(110,231,183,0.18)" : "rgba(255,255,255,0.12)",
        color:      active ? "#A7F3D0"                : "rgba(255,255,255,0.85)",
        border:     `1px solid ${active ? "rgba(110,231,183,0.35)" : "rgba(255,255,255,0.22)"}`,
      }}
    >
      {active && <span className="w-[6px] h-[6px] rounded-full" style={{ background: "#6EE7B7" }} />}
      {label}
    </span>
  );
}

// Profile hero: green banner with avatar, name, email and small status / role
// indicators stacked underneath. `children` (the loyalty card) is rendered
// inside the same green container, below the identity block.
export default function ProfileHero({ user, onPhotoChange, uploading, children }) {
  const fileRef = useRef(null);

  // Up to 2 uppercase initials as an avatar fallback
  const initials = (user.fullName || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const status   = user.status || "active";

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-12 pb-8 lg:pb-12" style={{ background: C.bannerGradient }}>
      {/* Stacked on small screens; identity left + loyalty card right on large screens */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7 lg:gap-10">

        {/* Hidden file input — accepts common image formats for avatar upload */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onPhotoChange}
        />

        {/* ── Identity: avatar + name / email / indicators ── */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left min-w-0">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-[88px] h-[88px] rounded-full flex items-center justify-center overflow-hidden text-[28px] font-bold text-white"
              style={{
                background: user.photoURL ? "transparent" : "rgba(255,255,255,0.18)",
                border: "3px solid rgba(255,255,255,0.45)",
                fontFamily: FONT.display,
              }}
            >
              {user.photoURL
                ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                : initials}
            </div>

            {/* Camera button — bottom-right of the avatar */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile photo"
              className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full flex items-center justify-center"
              style={{
                background: uploading ? "#9CC4B0" : C.accent,
                border: "2px solid #ffffff",
                cursor: uploading ? "not-allowed" : "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
            >
              {uploading
                ? <span className="w-[10px] h-[10px] border-2 border-white border-t-transparent rounded-full inline-block animate-spin" />
                : <Camera size={13} color="#ffffff" />}
            </button>
          </div>

          {/* Name, email, then small indicators — stacked */}
          <div className="flex flex-col items-center sm:items-start gap-[6px] min-w-0">
            <h1
              className="text-[26px] leading-tight font-bold text-white capitalize break-words"
              style={{ fontFamily: FONT.display }}
            >
              {user.fullName || "Customer"}
            </h1>
            <p className="text-[13px] break-all" style={{ color: "rgba(255,255,255,0.75)", fontFamily: FONT.body }}>
              {user.email}
            </p>
            <div className="flex gap-[6px] flex-wrap justify-center sm:justify-start mt-[2px]">
              <Badge label={status}                  active={status === "active"} />
              <Badge label={user.role || "customer"} active={false} />
            </div>
          </div>
        </div>

        {/* ── Slot: loyalty card, inside the green container ── */}
        {children && <div className="w-full lg:w-[460px] lg:shrink-0">{children}</div>}
      </div>
    </div>
  );
}
