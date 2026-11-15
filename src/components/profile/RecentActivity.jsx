import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ShoppingBag, FileText, ChevronRight, RefreshCw } from "lucide-react";
import { C, FONT } from "./profileTheme";
import { getRecentOrders, getRecentPrescriptions, toDate } from "../../services/customerProfileService";
import { ROUTES } from "../utils/constants";

// Maps free-form status strings from different writers to a colour.
function statusColor(status = "") {
  const s = status.toLowerCase();
  if (/(reject|cancel|fail)/.test(s))                  return { fg: C.dangerText, bg: C.dangerBg };
  if (/(dispens|deliver|complete|paid|approved)/.test(s)) return { fg: C.successText, bg: C.successBg };
  if (/(ready|pickup|ship|transit)/.test(s))           return { fg: "#2865A0", bg: "rgba(40,101,160,0.08)" };
  return { fg: C.gold, bg: "rgba(152,100,0,0.08)" }; // pending / under review / unknown
}

const fmtDate = (v) => toDate(v)?.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) || "—";
const fmtLKR  = (n) => (typeof n === "number" ? `LKR ${n.toLocaleString()}` : null);

function ActivityRow({ icon, title, subtitle, status, onClick }) {
  const Icon = icon;
  const { fg, bg } = statusColor(status);
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-[10px] cursor-pointer"
      style={{ background: "transparent", border: `1px solid ${C.border}`, fontFamily: FONT.body }}
    >
      <div className="w-[34px] h-[34px] rounded-lg shrink-0 flex items-center justify-center" style={{ background: C.accentFaint }}>
        <Icon size={15} color={C.accent} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold truncate" style={{ color: C.textPrimary }}>{title}</p>
        <p className="text-[11px] mt-[2px] truncate" style={{ color: C.textMuted }}>{subtitle}</p>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.06em] px-2 py-1 rounded-full shrink-0" style={{ color: fg, background: bg }}>
        {status || "Pending"}
      </span>
      <ChevronRight size={14} color={C.textMuted} className="shrink-0" />
    </button>
  );
}

// ── RecentActivity ────────────────────────────────────────────────────────────
// Shows the customer's 3 most recent shop orders and prescriptions, read
// directly from Firestore, with links through to the full pages.
export default function RecentActivity({ uid, email }) {
  const navigate = useNavigate();
  const [tab, setTab]                     = useState("prescriptions");
  const [orders, setOrders]               = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(false);

  const [reloadKey, setReloadKey]         = useState(0);

  // Fetch both lists independently so one failing doesn't hide the other.
  // `active` guards against setting state after unmount / uid change.
  useEffect(() => {
    let active = true;
    Promise.allSettled([getRecentOrders(email), getRecentPrescriptions(uid)]).then(([o, p]) => {
      if (!active) return;
      if (o.status === "fulfilled") setOrders(o.value); else console.error("Recent orders failed:", o.reason);
      if (p.status === "fulfilled") setPrescriptions(p.value); else console.error("Recent prescriptions failed:", p.reason);
      setError(o.status === "rejected" && p.status === "rejected");
      setLoading(false);
    });
    return () => { active = false; };
  }, [uid, email, reloadKey]);

  // Retry button handler
  const load = () => { setLoading(true); setError(false); setReloadKey((k) => k + 1); };

  const items = tab === "orders" ? orders : prescriptions;
  const viewAllRoute = tab === "orders" ? ROUTES.CUSTOMER_ORDERS : ROUTES.CUSTOMER_PRESCRIPTION;

  const tabBtn = (key, label, icon, count) => {
    const Icon = icon;
    return (
    <button
      key={key}
      onClick={() => setTab(key)}
      className="flex items-center gap-[6px] text-[12px] font-semibold px-3 py-[6px] rounded-lg cursor-pointer"
      style={{
        fontFamily: FONT.body,
        color: tab === key ? "#fff" : C.textMuted,
        background: tab === key ? C.accent : "transparent",
        border: `1px solid ${tab === key ? C.accent : C.border}`,
      }}
    >
      <Icon size={12} /> {label}{!loading && ` (${count})`}
    </button>
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
      <div className="px-5 py-[14px] flex flex-wrap gap-2 justify-between items-center" style={{ background: C.accentFaint, borderBottom: `1px solid ${C.border}` }}>
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] flex items-center gap-[6px]" style={{ color: C.textMuted }}>
          <Clock size={12} color={C.accent} /> Recent Activity
        </p>
        <div className="flex gap-2">
          {tabBtn("prescriptions", "Prescriptions", FileText, prescriptions.length)}
          {tabBtn("orders", "Orders", ShoppingBag, orders.length)}
        </div>
      </div>

      <div className="px-5 py-[18px] flex flex-col gap-[10px]">
        {loading && <p className="text-[13px]" style={{ color: C.textMuted }}>Loading recent activity…</p>}

        {!loading && error && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px]" style={{ color: C.dangerText }}>Couldn't load your recent activity.</p>
            <button onClick={load} className="flex items-center gap-1 text-[12px] font-semibold px-3 py-[6px] rounded-lg cursor-pointer"
              style={{ color: C.accent, background: C.accentFaint, border: `1px solid ${C.border}`, fontFamily: FONT.body }}>
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-[13px] py-2" style={{ color: C.textMuted }}>
            {tab === "orders" ? "You haven't placed any orders yet." : "You haven't uploaded any prescriptions yet."}
          </p>
        )}

        {!loading && !error && tab === "prescriptions" && prescriptions.map((p) => (
          <ActivityRow
            key={p.id}
            icon={FileText}
            title={p.doctorName ? `Prescription · ${p.doctorName}` : `Prescription #${p.id.slice(-6).toUpperCase()}`}
            subtitle={[fmtDate(p.createdAt), p.medications?.length ? `${p.medications.length} item(s)` : null].filter(Boolean).join(" · ")}
            status={p.status}
            onClick={() => navigate(ROUTES.CUSTOMER_PRESCRIPTION)}
          />
        ))}

        {!loading && !error && tab === "orders" && orders.map((o) => (
          <ActivityRow
            key={o.id}
            icon={ShoppingBag}
            title={`Order #${String(o.orderId || o.id).slice(-6).toUpperCase()}`}
            subtitle={[fmtDate(o.createdAt), fmtLKR(o.totalAmount)].filter(Boolean).join(" · ")}
            status={o.orderStatus || o.status}
            onClick={() => navigate(ROUTES.CUSTOMER_ORDERS)}
          />
        ))}

        {!loading && !error && items.length > 0 && (
          <button
            onClick={() => navigate(viewAllRoute)}
            className="self-end text-[12px] font-semibold cursor-pointer mt-1"
            style={{ color: C.accent, background: "none", border: "none", fontFamily: FONT.body }}
          >
            View all {tab} →
          </button>
        )}
      </div>
    </div>
  );
}
