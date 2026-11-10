import { STATUS_OPTIONS } from './orderHelpers';

export const OrderFilters = ({ searchTerm, onSearch, statusFilter, onStatusFilter }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
    <input
      type="text"
      placeholder="Search by PO ID, Product, or Supplier..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg text-[15px] mb-4 transition-all duration-200 focus:outline-none focus:border-[#16734B] focus:ring-4 focus:ring-[#16734B]/10"
    />
    <div className="flex gap-2.5 flex-wrap">
      {STATUS_OPTIONS.map((status) => (
        <button
          key={status}
          onClick={() => onStatusFilter(status)}
          className={`px-4 py-2 rounded-full border-2 text-sm font-medium cursor-pointer transition-all duration-200
            ${statusFilter === status
              ? 'bg-[#16734B] text-white border-[#16734B]'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
        >
          {status}
        </button>
      ))}
    </div>
  </div>
);