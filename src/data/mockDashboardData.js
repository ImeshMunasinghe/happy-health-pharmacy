// ─── CENTRAL MOCK DATASET FOR HAPPY HEALTH PHARMACY MIS ────────────────────────
// Provides authentic, realistic Sri Lankan pharmacy clinical & operational data
// to render all role dashboards without requiring active Firebase / backend connections.

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ADMIN DASHBOARD MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_ADMIN_STATS = {
  users: 184,
  suppliers: 16,
  products: 342,
  revenue: 1485200,
  cost: 924500,
  profit: 560700,
};

export const MOCK_ADMIN_MONTHLY = [
  { month: "Jan", revenue: 98000,  cost: 65000,  profit: 33000 },
  { month: "Feb", revenue: 105000, cost: 71000,  profit: 34000 },
  { month: "Mar", revenue: 114000, cost: 74000,  profit: 40000 },
  { month: "Apr", revenue: 122000, cost: 81000,  profit: 41000 },
  { month: "May", revenue: 118000, cost: 79000,  profit: 39000 },
  { month: "Jun", revenue: 130000, cost: 84000,  profit: 46000 },
  { month: "Jul", revenue: 138000, cost: 89000,  profit: 49000 },
  { month: "Aug", revenue: 145000, cost: 92000,  profit: 53000 },
  { month: "Sep", revenue: 152000, cost: 96000,  profit: 56000 },
  { month: "Oct", revenue: 161000, cost: 101000, profit: 60000 },
  { month: "Nov", revenue: 174000, cost: 108000, profit: 66000 },
];

export const MOCK_ADMIN_RECENT_ORDERS = [
  {
    id: "po-01",
    poId: "PO-2026-0891",
    product: "Amoxicillin 500mg (500 Caps)",
    supplierName: "State Pharmaceuticals Corp",
    quantity: 50,
    totalAmount: 48500,
    status: "APPROVED",
  },
  {
    id: "po-02",
    poId: "PO-2026-0892",
    product: "Paracetamol 500mg (1000 Tabs)",
    supplierName: "A. Baur & Co. Healthcare",
    quantity: 120,
    totalAmount: 36000,
    status: "DELIVERED",
  },
  {
    id: "po-03",
    poId: "PO-2026-0893",
    product: "Metformin 500mg (500 Tabs)",
    supplierName: "Hemas Pharmaceuticals",
    quantity: 60,
    totalAmount: 28200,
    status: "PENDING",
  },
  {
    id: "po-04",
    poId: "PO-2026-0894",
    product: "Omeprazole 20mg (300 Caps)",
    supplierName: "Sunshine Healthcare Lanka",
    quantity: 40,
    totalAmount: 34000,
    status: "IN DELIVERY",
  },
  {
    id: "po-05",
    poId: "PO-2026-0895",
    product: "Atorvastatin 20mg (200 Tabs)",
    supplierName: "Emerchemie NB Lanka",
    quantity: 30,
    totalAmount: 41500,
    status: "APPROVED",
  },
];

export const MOCK_ADMIN_LOW_STOCK = [
  {
    id: "ls-1",
    productName: "Amoxicillin 500mg BP",
    supplierName: "State Pharmaceuticals Corp",
    stock: 12,
    category: "Antibiotics",
  },
  {
    id: "ls-2",
    productName: "Insulin Regular 100IU/ml",
    supplierName: "Novo Nordisk Lanka",
    stock: 8,
    category: "Antidiabetic",
  },
  {
    id: "ls-3",
    productName: "Salbutamol Inhaler 100mcg",
    supplierName: "GlaxoSmithKline LK",
    stock: 16,
    category: "Respiratory",
  },
  {
    id: "ls-4",
    productName: "Losartan Potassium 50mg",
    supplierName: "Hemas Pharmaceuticals",
    stock: 24,
    category: "Cardiovascular",
  },
  {
    id: "ls-5",
    productName: "Cetirizine 10mg Film-Coated",
    supplierName: "Sunshine Healthcare Lanka",
    stock: 35,
    category: "Antihistamine",
  },
  {
    id: "ls-6",
    productName: "Azithromycin 500mg (3 Tabs)",
    supplierName: "Morison Healthcare PLC",
    stock: 42,
    category: "Antibiotics",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PHARMACIST DASHBOARD & CLINICAL MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_PHARMACIST_STATS = {
  dailyRevenue: 85500,
  walkinRxRev: 42500,
  walkinOtcRev: 18200,
  onlinePaidRev: 16800,
  onlineCodRev: 8000,
  onlineRevCard: 11200,
  onlineRevBank: 5600,
  onlineRevPayHere: 0,
  onlineRevCod: 8000,
  dispensedTodayCount: 28,
  physicalDispensedCount: 19,
  onlineDispensedCount: 9,
  totalPatientsCount: 142,
  totalInventoryCount: 342,
  pendingReturns: 2,
};

export const MOCK_PHARMACIST_ACTIVITY_LOG = [
  {
    id: "act-1",
    timeLabel: "08:35 AM",
    color: "bg-emerald-500",
    text: "Dispensed Rx #RX-8940 to Anura Senanayake (Losartan 50mg)",
    highlight: "Dispensed",
    highlightColor: "text-emerald-600",
  },
  {
    id: "act-2",
    timeLabel: "09:12 AM",
    color: "bg-emerald-500",
    text: "Dispensed Rx #RX-8941 to Nimal Perera (Amoxicillin 500mg)",
    highlight: "Dispensed",
    highlightColor: "text-emerald-600",
  },
  {
    id: "act-3",
    timeLabel: "10:05 AM",
    color: "bg-[#16734B]",
    text: "Online order Dispatched - Kusal Mendis (#ORD-7721)",
    highlight: "Dispatched",
    highlightColor: "text-[#16734B]",
  },
  {
    id: "act-4",
    timeLabel: "10:48 AM",
    color: "bg-emerald-500",
    text: "Dispensed Rx #RX-8942 to Sunethra Bandara (Metformin 500mg)",
    highlight: "Dispensed",
    highlightColor: "text-emerald-600",
  },
  {
    id: "act-5",
    timeLabel: "11:30 AM",
    color: "bg-amber-400",
    text: "Return request Pending - Amoxicillin Syrup (Tampered Seal)",
    highlight: "Pending",
    highlightColor: "text-amber-600",
  },
  {
    id: "act-6",
    timeLabel: "01:15 PM",
    color: "bg-emerald-500",
    text: "Dispensed Rx #RX-8943 to Priyantha Silva (Atorvastatin 20mg)",
    highlight: "Dispensed",
    highlightColor: "text-emerald-600",
  },
  {
    id: "act-7",
    timeLabel: "02:22 PM",
    color: "bg-[#16734B]",
    text: "Online order Dispatched - Dinithi Fernando (#ORD-7725)",
    highlight: "Dispatched",
    highlightColor: "text-[#16734B]",
  },
  {
    id: "act-8",
    timeLabel: "03:40 PM",
    color: "bg-emerald-500",
    text: "Dispensed Rx #RX-8944 to Kamani Jayawardena (Omeprazole 20mg)",
    highlight: "Dispensed",
    highlightColor: "text-emerald-600",
  },
];

export const MOCK_PHARMACIST_LOW_STOCK = [
  { id: "p1", name: "Amoxicillin 500mg", category: "Antibiotics", stock: 12, unitPrice: 22 },
  { id: "p2", name: "Insulin Regular 100IU", category: "Antidiabetic", stock: 8, unitPrice: 1250 },
  { id: "p3", name: "Salbutamol Inhaler", category: "Respiratory", stock: 16, unitPrice: 680 },
  { id: "p4", name: "Losartan 50mg", category: "Cardiovascular", stock: 24, unitPrice: 18 },
];

export const MOCK_PHARMACIST_EXPIRING = [
  { id: "e1", name: "Cough Syrup Dextro 100ml", batch: "B-8821", expiry: "2026-12-15", stock: 14 },
  { id: "e2", name: "Eye Drops Ciprofloxacin", batch: "B-7712", expiry: "2026-12-28", stock: 9 },
  { id: "e3", name: "Amoxicillin Clavulanic Susp.", batch: "B-9014", expiry: "2027-01-10", stock: 22 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SUPPLIER DASHBOARD MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_SUPPLIER_STATS = {
  totalPOs: 18,
  pendingOrders: 3,
  deliveredOrders: 14,
  lowStockAlerts: 4,
};

export const MOCK_SUPPLIER_RECENT_ORDERS = [
  {
    id: "po-101",
    poId: "PO-8901",
    product: "Amoxicillin 500mg BP (500 Caps)",
    pharmacy: "Happy Health Main Dispensary",
    quantity: 50,
    amount: 48500,
    status: "APPROVED",
    date: "10 Nov 2026",
  },
  {
    id: "po-102",
    poId: "PO-8902",
    product: "Ciprofloxacin 500mg (250 Tabs)",
    pharmacy: "Happy Health Main Dispensary",
    quantity: 30,
    amount: 27900,
    status: "PENDING",
    date: "10 Nov 2026",
  },
  {
    id: "po-103",
    poId: "PO-8903",
    product: "Azithromycin 500mg (100 Tabs)",
    pharmacy: "Happy Health Main Dispensary",
    quantity: 20,
    amount: 32000,
    status: "IN DELIVERY",
    date: "09 Nov 2026",
  },
  {
    id: "po-104",
    poId: "PO-8904",
    product: "Cephalexin 250mg (400 Caps)",
    pharmacy: "Happy Health Main Dispensary",
    quantity: 45,
    amount: 38250,
    status: "DELIVERED",
    date: "07 Nov 2026",
  },
  {
    id: "po-105",
    poId: "PO-8905",
    product: "Doxycycline 100mg (300 Caps)",
    pharmacy: "Happy Health Main Dispensary",
    quantity: 25,
    amount: 19500,
    status: "DELIVERED",
    date: "04 Nov 2026",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CUSTOMER / PATIENT PORTAL MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const MOCK_CUSTOMER_PRESCRIPTION = {
  id: "RX-2026-9042",
  type: "prescription",
  orderStatus: "ready for pickup", // Triggers Step 3 on the 4-step stepper!
  status: "ready for pickup",
  doctorName: "Dr. K. L. Wickramasinghe (MBBS, MD)",
  clinic: "Asiri Central Hospital - Colombo",
  customerName: "Patient Account",
  phone: "077 123 4567",
  address: "No. 45, Galle Road, Colombo 03",
  notes: "Take Amoxicillin with meals. Complete the full 7-day course.",
  createdAt: "2026-11-10T14:30:00Z",
  totalAmount: 1450,
  paymentMethod: "Pay on Collection (Counter)",
  paymentStatus: "Pending Pickup",
  medications: [
    { name: "Amoxicillin 500mg", qty: "21 Capsules (1 cap tds x 7 days)", price: 1050 },
    { name: "Paracetamol 500mg", qty: "20 Tablets (2 tabs prn)", price: 400 },
  ],
  types: [
    { name: "Amoxicillin 500mg", quantity: "21 Capsules", price: 1050, id: "RX-ITEM-1" },
    { name: "Paracetamol 500mg", quantity: "20 Tablets", price: 400, id: "RX-ITEM-2" },
  ],
};

export const MOCK_CUSTOMER_PAST_ORDERS = [
  {
    id: "RX-2026-8810",
    type: "prescription",
    orderStatus: "dispensed",
    status: "dispensed",
    doctorName: "Dr. Nihal Abeykoon (Consultant Physician)",
    clinic: "Nawaloka Hospital",
    customerName: "Patient Account",
    phone: "077 123 4567",
    address: "No. 45, Galle Road, Colombo 03",
    notes: "Chronic hypertension refill",
    createdAt: "2026-10-24T09:15:00Z",
    totalAmount: 2180,
    paymentMethod: "Visa Card (Counter POS)",
    paymentStatus: "paid",
    medications: [
      { name: "Losartan Potassium 50mg", qty: "30 Tablets (1 daily)", price: 1100 },
      { name: "Atorvastatin 20mg", qty: "30 Tablets (1 nocte)", price: 1080 },
    ],
    types: [
      { name: "Losartan Potassium 50mg", quantity: "30 Tablets", price: 1100, id: "RX-ITEM-3" },
      { name: "Atorvastatin 20mg", quantity: "30 Tablets", price: 1080, id: "RX-ITEM-4" },
    ],
  },
];

