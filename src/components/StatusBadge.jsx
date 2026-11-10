export default function StatusBadge({ status }) {
  const base =
    "inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";

  const variants = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-emerald-100 text-emerald-700",
    completed: "bg-[#EBF5EE] text-[#16734B]",
    rejected: "bg-red-100 text-red-700",
    cancelled: "bg-gray-100 text-gray-600",
  };

  const style = variants[status.toLowerCase()] ?? "bg-gray-100 text-gray-600";

  return <span className={`${base} ${style}`}>{status.toUpperCase()}</span>;
}