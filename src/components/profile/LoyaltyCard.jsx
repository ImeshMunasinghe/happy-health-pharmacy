import { useState, useRef, useEffect } from "react";
import { Star, Copy, CheckCircle, Gift, Zap, Trophy, Award } from "lucide-react";
import { FONT } from "./profileTheme";

// Level thresholds — must match backend calculateLevel() in loyalty.service.ts
// Silver: 1000–1999 | Gold: 2000–4999 | Platinum: 5000+
const LEVELS = {
  Silver:   { min: 1000, max: 2000, next: "Gold",     color: "#E2E8F0", Icon: Star },
  Gold:     { min: 2000, max: 5000, next: "Platinum", color: "#FCD34D", Icon: Trophy },
  Platinum: { min: 5000, max: 5000, next: null,       color: "#DDD6FE", Icon: Award },
};

// Frosted-glass panel styles, designed to sit on the green profile banner.
const glass = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.20)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
};
const muted = "rgba(255,255,255,0.65)";

export default function LoyaltyCard({ user }) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Copies the customer ID and briefly shows a confirmation state
  const copy = async () => {
    if (!user?.customerId) return;
    try {
      await navigator.clipboard.writeText(user.customerId);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked — ignore */ }
  };

  const level     = LEVELS[user.level] ? user.level : "Silver";
  const lvl       = LEVELS[level];
  const LevelIcon = lvl.Icon;
  const points    = user.totalPoints ?? user.loyaltyPoints ?? 0;
  const progress  = lvl.next
    ? Math.min(100, Math.max(0, ((points - lvl.min) / (lvl.max - lvl.min)) * 100))
    : 100;
  const ptsToNext = lvl.next ? Math.max(0, lvl.max - points) : 0;

  return (
    <div className="rounded-2xl overflow-hidden text-white" style={{ ...glass, fontFamily: FONT.body }}>

      {/* ── Top row: points | level + customer ID ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5 pb-4">

        {/* Points */}
        <div className="flex items-center gap-[14px]">
          <div
            className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <Star size={22} color={lvl.color} fill={lvl.color} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: muted }}>
              Loyalty Points
            </p>
            <p className="text-[32px] font-extrabold leading-none mt-[2px]">
              {points.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Level pill + customer ID */}
        <div className="flex flex-col items-end gap-2">
          <span
            className="inline-flex items-center gap-[6px] text-[11px] font-bold px-3 py-[5px] rounded-full tracking-[0.04em]"
            style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", color: lvl.color }}
          >
            <LevelIcon size={12} /> {level} Member
          </span>

          {user.customerId && (
            <button
              onClick={copy}
              title="Copy customer ID"
              className="inline-flex items-center gap-[6px] text-[12px] font-bold px-3 py-[5px] rounded-lg cursor-pointer"
              style={{
                fontFamily: "'DM Mono', ui-monospace, monospace",
                color: "#fff",
                background: copied ? "rgba(110,231,183,0.22)" : "rgba(0,0,0,0.15)",
                border: `1px solid ${copied ? "rgba(110,231,183,0.45)" : "rgba(255,255,255,0.18)"}`,
              }}
            >
              {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : user.customerId}
            </button>
          )}
        </div>
      </div>

      {/* ── Progress to next level ── */}
      {lvl.next && (
        <div className="px-5 pb-5">
          <div className="flex justify-between items-center mb-2 text-[11px] font-semibold" style={{ color: muted }}>
            <span className="flex items-center gap-1"><Zap size={10} /> {level}</span>
            <span>
              {ptsToNext > 0
                ? <><strong className="text-white">{ptsToNext.toLocaleString()}</strong> pts to {lvl.next}</>
                : <span className="inline-flex items-center gap-1 text-white"><CheckCircle size={12} /> {lvl.next} unlocked!</span>}
            </span>
          </div>
          <div className="h-[8px] rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.18)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, #6EE7B7, ${lvl.color})`,
                transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      )}

      {/* ── Recommended offers (only when available) ── */}
      {user.recommendedOffers?.length > 0 && (
        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <p className="flex items-center gap-[5px] text-[10px] font-bold uppercase tracking-[0.12em] mb-[10px]" style={{ color: muted }}>
            <Gift size={11} /> Your Offers
          </p>
          <div className="flex flex-col gap-[6px]">
            {user.recommendedOffers.map((offer, i) => (
              <div
                key={i}
                className="flex items-center gap-[10px] px-[14px] py-[9px] rounded-xl text-[12px] font-medium"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Trophy size={13} color="#FCD34D" className="shrink-0" />
                {offer}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
