const ProductCatalogHeader = ({ currentUser }) => {
  return (
    <div className="mb-6 bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-[28px] font-bold mb-1 text-slate-900">Product Catalog</h1>
      <p className="text-slate-500 text-sm">Manage your products supplied to Happy Health Pharmacy</p>
      {currentUser && (
        <span className="inline-block mt-3 bg-[#EBF5EE] text-[#16734B] text-[13px] font-semibold px-3 py-1 rounded-full">
          Logged in as: {currentUser.name}
        </span>
      )}
    </div>
  );
};

export default ProductCatalogHeader;