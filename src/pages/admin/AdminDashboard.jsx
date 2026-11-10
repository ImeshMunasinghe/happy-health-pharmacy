import { useState } from "react";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import PageLayout from "../../components/PageLayout";
import ResponsiveTable from "../../components/ResponsiveTable";
import {
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_MONTHLY,
  MOCK_ADMIN_RECENT_ORDERS,
  MOCK_ADMIN_LOW_STOCK,
} from "../../data/mockDashboardData";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Users, 
  Award,
  Sparkles
} from "lucide-react";

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const FinancialTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#DAE5DE] rounded-xl p-3 shadow-lg text-xs">
        <p className="text-slate-500 mb-2 font-semibold">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            <span className="text-slate-500 capitalize">{entry.name}:</span>
            <span className="text-slate-800 font-bold">Rs. {Number(entry.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Stock Bar ─────────────────────────────────────────────────────────────────
const StockBar = ({ stock, max = 100 }) => {
  const pct   = Math.min((stock / max) * 100, 100);
  const color = stock <= 30 ? "#ef4444" : stock <= 70 ? "#f59e0b" : "#16734B";
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
};

// ─── Recent Orders table columns ───────────────────────────────────────────────
const orderColumns = [
  {
    key: "poId",
    label: "Order ID",
    render: (val, row) => (
      <span className="text-[#16734B] font-mono text-xs font-bold">{val || row.id}</span>
    ),
  },
  {
    key: "product",
    label: "Product",
    render: (val) => <span className="font-medium text-gray-700">{val || "N/A"}</span>,
  },
  { key: "supplierName", label: "Supplier" },
  {
    key: "quantity",
    label: "Quantity",
    render: (val) => val || 0,
  },
  {
    key: "totalAmount",
    label: "Amount",
    render: (val) => `Rs. ${(val || 0).toLocaleString()}`,
  },
  {
    key: "status",
    label: "Status",
    render: (val) => <StatusBadge status={val || "pending"} />,
  },
];

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats]        = useState(MOCK_ADMIN_STATS);
  const [monthlyData]  = useState(MOCK_ADMIN_MONTHLY);
  const [recentOrders] = useState(MOCK_ADMIN_RECENT_ORDERS);
  const [lowStockItems]= useState(MOCK_ADMIN_LOW_STOCK);

  return (
    <PageLayout title="Admin Management Dashboard" subtitle="Happy Health · Pharmacy MIS">

      {/* ── 3-TIER DECISION SUPPORT: STRATEGIC LEVEL OVERVIEW ── */}
      <div className="mb-6 bg-gradient-to-r from-[#16734B] to-[#10573A] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
              STRATEGIC LEVEL — Executive Decision Support
            </span>
            <span className="text-[11px] font-semibold text-emerald-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 3-Tier MIS Architecture (Strategic · Tactical · Operational)
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black mb-1">
            Happy Health Pharmacy Enterprise Overview
          </h2>
          <p className="text-emerald-100 text-xs md:text-sm max-w-2xl font-medium mb-5">
            Real-time aggregate performance indicators governing financial viability, prescription fulfillment compliance, supply chain continuity, and patient retention.
          </p>

          {/* 4 Strategic KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Revenue Trajectory</span>
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xl md:text-2xl font-black">Rs. {(stats.revenue || 48750).toLocaleString()}</p>
              <span className="text-[10px] text-emerald-300 font-bold mt-1 inline-block">+14.2% YoY growth</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Rx Fulfillment Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xl md:text-2xl font-black">98.6%</p>
              <span className="text-[10px] text-emerald-300 font-bold mt-1 inline-block">Surpasses 95% SLA</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Stockout Frequency</span>
                <AlertCircle className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xl md:text-2xl font-black">1.2%</p>
              <span className="text-[10px] text-emerald-300 font-bold mt-1 inline-block">Target &lt; 2.0% achieved</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/15">
              <div className="flex items-center justify-between text-emerald-200 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider">Patient Growth</span>
                <Users className="w-4 h-4 text-emerald-300" />
              </div>
              <p className="text-xl md:text-2xl font-black">+{stats.users || 28}</p>
              <span className="text-[10px] text-emerald-300 font-bold mt-1 inline-block">91.4% repeat retention</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="flex gap-6 flex-col xl:flex-row">

        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 md:gap-6">

          {/* Operational Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            <Card title="Total Users"    value={stats.users} />
            <Card title="Suppliers"      value={stats.suppliers} />
            <Card title="Products"       value={stats.products} />
            <Card title="Total Revenue"  value={`Rs. ${stats.revenue.toLocaleString()}`} />
            <Card title="Total Payments" value={`Rs. ${stats.cost.toLocaleString()}`} />
            <Card title="Net Profit"     value={`Rs. ${stats.profit.toLocaleString()}`} />
          </div>

          {/* ── Financial Chart ── */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#DAE5DE]">
            <div className="flex items-start md:items-center justify-between mb-5 flex-col md:flex-row gap-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-[#142D23]">Revenue vs Payments vs Profit</h3>
                <p className="text-[#52665D] text-xs mt-0.5">Monthly financial overview and operating margins</p>
              </div>
              <div className="flex gap-3 text-xs text-[#52665D] flex-wrap">
                {[
                  { label: "Revenue",  color: "#16734B" },
                  { label: "Payments", color: "#52665D" },
                  { label: "Profit",   color: "#238C5D" },
                ].map(({ label, color }) => (
                  <span key={label} className="flex items-center gap-1.5 font-semibold">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: color }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {monthlyData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
                No financial data recorded yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} barCategoryGap="30%" barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBF5EE" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#52665D", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#52665D", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} width={35} />
                  <Tooltip content={<FinancialTooltip />} cursor={{ fill: "rgba(22,115,75,0.04)" }} />
                  <Bar dataKey="revenue" name="Revenue"  fill="#16734B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost"    name="Payments" fill="#52665D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit"  name="Profit"   fill="#238C5D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Recent Orders — uses ResponsiveTable ── */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#DAE5DE]">
            <h3 className="text-base md:text-lg font-bold text-[#142D23] mb-4">Recent Procurement Orders</h3>
            <ResponsiveTable
              columns={orderColumns}
              data={recentOrders}
              keyField="id"
              cardTitle="poId"
              cardBadge="status"
              emptyMessage="No recent purchase orders"
            />
          </div>
        </div>

        {/* ── RIGHT: Low Stock Sidebar ── */}
        <div className="xl:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-[#DAE5DE] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-base font-bold text-[#142D23]">Low Stock Alert</h3>
              </div>
              <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {lowStockItems.length}
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-[#52665D] text-sm text-center font-medium">All dispensary products are sufficiently stocked</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto pr-0.5"
                style={{ maxHeight: "560px", scrollbarWidth: "thin", scrollbarColor: "#DAE5DE transparent" }}>
                {lowStockItems.map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#DAE5DE] bg-[#F7FAF8] p-3 hover:border-[#16734B] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#142D23] text-sm font-bold truncate">{item.productName}</p>
                        <p className="text-[#52665D] text-[11px] truncate mt-0.5">{item.supplierName || "No supplier"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-black ${item.stock <= 30 ? "text-red-500" : item.stock <= 70 ? "text-amber-600" : "text-[#16734B]"}`}>
                          {item.stock}
                        </p>
                        <p className="text-[10px] text-[#52665D]">units</p>
                      </div>
                    </div>
                    <StockBar stock={item.stock} max={100} />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-[#52665D] bg-[#EBF5EE] px-2 py-0.5 rounded-full font-semibold">
                        {item.category || "General"}
                      </span>
                      {item.stock === 0        && <span className="text-[10px] text-red-600 font-bold uppercase">Out of Stock</span>}
                      {item.stock > 0  && item.stock <= 30 && <span className="text-[10px] text-red-600 font-bold">Critical</span>}
                      {item.stock > 30 && item.stock <= 70 && <span className="text-[10px] text-amber-600 font-bold">Low</span>}
                      {item.stock > 70 && <span className="text-[10px] text-[#16734B] font-bold">Reorder</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#DAE5DE] flex gap-3 flex-wrap">
              {[
                { color: "bg-red-500",   label: "Critical (0-30)"  },
                { color: "bg-amber-500", label: "Low (31-70)"       },
                { color: "bg-[#16734B]", label: "Reorder (71-100)" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[10px] text-[#52665D] font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
