const PurchaseOrderHeader = ({ supplierName }) => {
  return (
    <div className="mb-7 bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-[28px] font-bold mb-1 text-slate-900">Purchase Orders</h1>
      <p className="text-slate-500 text-sm">Orders received from Happy Health Pharmacy</p>
      {supplierName && (
        <span className="inline-block mt-3 bg-[#EBF5EE] text-[#16734B] text-[13px] font-semibold px-3 py-1 rounded-full">
          Logged in as: {supplierName}
        </span>
      )}
    </div>
  );
};

export default PurchaseOrderHeader;