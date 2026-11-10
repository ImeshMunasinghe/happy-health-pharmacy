import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Pill, 
  Snowflake, 
  Search, 
  Plus, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  ExternalLink,
  ChevronRight,
  Filter,
  Info,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

// Default preloaded clinical drug monographs
const initialDrugs = [
  {
    id: 'DRUG-001',
    brandName: 'Panadol 500mg',
    genericName: 'Paracetamol / Acetaminophen',
    category: 'Analgesics & Antipyretics',
    dosage: '500mg - 1000mg every 4-6 hours (Max 4000mg/24h)',
    storage: 'Store below 25°C, protect from moisture and light',
    contraindications: 'Severe hepatic impairment, active viral hepatitis, chronic alcoholism.',
    precautions: 'Do not co-prescribe with other paracetamol-containing OTC formulations. Monitor LFTs in chronic therapy.',
    pregnancyCategory: 'Category B - Considered safe under therapeutic dosing',
    dispensingChecklist: ['Verify 24h cumulative dose', 'Advise no alcohol consumption', 'Check for duplicate paracetamol products']
  },
  {
    id: 'DRUG-002',
    brandName: 'Amoxil 500mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics & Anti-infectives',
    dosage: '250mg - 500mg every 8 hours, or 875mg every 12 hours',
    storage: 'Store capsules at 20-25°C. Reconstituted suspension in fridge (2-8°C) for 14 days.',
    contraindications: 'History of severe allergic reaction (anaphylaxis) to beta-lactam antibiotics.',
    precautions: 'Risk of maculopapular rash if administered during infectious mononucleosis. Complete full course.',
    pregnancyCategory: 'Category B - Generally acceptable in pregnancy',
    dispensingChecklist: ['Check penicillin allergy history', 'Instruct patient to complete entire course', 'Advise taking with meals to reduce GI upset']
  },
  {
    id: 'DRUG-003',
    brandName: 'Glucophage 500mg',
    genericName: 'Metformin Hydrochloride',
    category: 'Endocrine & Antidiabetic',
    dosage: 'Initial 500mg twice daily with meals; titrate to max 2000mg-2550mg daily',
    storage: 'Store below 30°C in airtight containers.',
    contraindications: 'Severe renal impairment (eGFR < 30 mL/min), acute metabolic acidosis, severe hypoxemia.',
    precautions: 'Risk of lactic acidosis. Withhold 48 hours prior to iodinated radiocontrast procedures.',
    pregnancyCategory: 'Category B - Use under endocrinologist guidance',
    dispensingChecklist: ['Confirm renal function (eGFR > 30)', 'Take strictly with or after food', 'Warn about GI symptoms in first 2 weeks']
  },
  {
    id: 'DRUG-004',
    brandName: 'Losec 20mg',
    genericName: 'Omeprazole',
    category: 'Gastrointestinal',
    dosage: '20mg - 40mg once daily in the morning 30-60 minutes before breakfast',
    storage: 'Store below 25°C, protect from moisture in blister foil.',
    contraindications: 'Hypersensitivity to substituted benzimidazoles. Co-administration with rilpivirine.',
    precautions: 'Long-term use may cause hypomagnesemia, vitamin B12 deficiency, and increased fracture risk.',
    pregnancyCategory: 'Category C - Safe when clinical benefit outweighs risk',
    dispensingChecklist: ['Swallow whole, do not crush or chew beads', 'Take 30 mins before first meal of day']
  },
  {
    id: 'DRUG-005',
    brandName: 'Lipitor 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Cardiovascular',
    dosage: '10mg - 80mg once daily at evening/night',
    storage: 'Store at 20°C to 25°C.',
    contraindications: 'Active liver disease, unexplained persistent elevations of transaminases, pregnancy.',
    precautions: 'Risk of myopathy and rhabdomyolysis. Avoid large volumes of grapefruit juice (>1L/day).',
    pregnancyCategory: 'Category X - Strictly contraindicated in pregnancy',
    dispensingChecklist: ['Verify patient is not pregnant', 'Instruct to report unexplained muscle pain or dark urine immediately']
  },
  {
    id: 'DRUG-006',
    brandName: 'Cozaar 50mg',
    genericName: 'Losartan Potassium',
    category: 'Cardiovascular',
    dosage: '50mg once daily; maximum 100mg daily in single or two divided doses',
    storage: 'Store at 25°C (15°C to 30°C permitted). Protect from light.',
    contraindications: 'Hypersensitivity, co-administration with aliskiren in patients with diabetes, 2nd/3rd trimester pregnancy.',
    precautions: 'Monitor serum potassium and renal function regularly. Risk of hypotension in volume-depleted patients.',
    pregnancyCategory: 'Category D - Black Box Warning for fetal toxicity',
    dispensingChecklist: ['Verify baseline serum potassium', 'Check for concurrent potassium supplements or ACE-inhibitors']
  },
  {
    id: 'DRUG-007',
    brandName: 'Ventolin Evohaler',
    genericName: 'Salbutamol Sulfate 100mcg/dose',
    category: 'Respiratory',
    dosage: '1-2 puffs as required for acute bronchospasm; max 8 puffs/24h',
    storage: 'Store below 30°C. Protect from frost and direct sunlight.',
    contraindications: 'Hypersensitivity to salbutamol. Not for management of threatened abortion.',
    precautions: 'Excessive use indicates unstable asthma. Monitor for hypokalemia with concomitant high doses.',
    pregnancyCategory: 'Category C - Widely used when clinically indicated',
    dispensingChecklist: ['Demonstrate inhaler technique / spacer usage', 'Advise to seek emergency care if relief lasts < 3 hours']
  }
];

// Preloaded Pharmacy Standard Operating Procedures (SOPs)
const initialSOPs = [
  {
    id: 'SOP-DISP-001',
    title: 'Good Dispensing Practice & 5-Rights Verification',
    category: 'Dispensing Protocols',
    version: 'v3.2',
    lastReviewed: '2026-01-15',
    reviewCycle: 'Annual',
    status: 'Active',
    summary: 'Standard workflow for verifying, preparing, labeling, and handing over prescription medications at counter.',
    steps: [
      'Validate prescription legitimacy (SLMC registration number, prescriber signature, date within 30 days).',
      'Verify the 5 Rights: Right Patient, Right Drug, Right Dose, Right Route, Right Timing/Frequency.',
      'Perform Clinical Safety Check (Drug-Drug interactions, patient allergies, renal dose adjustments).',
      'Select stock using barcode scan or dual check against batch number and expiry date (>6 months validity).',
      'Apply standardized Happy Health auxiliary cautionary labels (e.g., With Food, Shake Well, Finish All).',
      'Deliver verbal counseling to patient or caregiver covering indication, storage, side effects, and missed dose protocol.'
    ]
  },
  {
    id: 'SOP-STOR-002',
    title: 'Cold-Chain Biologicals & Vaccine Management',
    category: 'Inventory & Storage',
    version: 'v2.1',
    lastReviewed: '2026-02-10',
    reviewCycle: 'Bi-annual',
    status: 'Active',
    summary: 'Protocols for temperature monitoring, refrigerator maintenance, and temperature excursion response.',
    steps: [
      'Maintain dedicated pharmacy refrigerator temperature strictly between 2.0°C and 8.0°C.',
      'Log minimum, current, and maximum temperatures twice daily (08:30 and 16:30) using digital calibrated data logger.',
      'In the event of an excursion (<2°C or >8°C for >30 minutes), quarantine biologicals immediately in secondary insulated cool-box with ice packs.',
      'Notify Responsible Pharmacist and document duration and highest temperature in Form CC-LOG-03.',
      'Never freeze liquid vaccines (Insulin, Tetanus toxoid, Hepatitis B vaccine).'
    ]
  },
  {
    id: 'SOP-NAR-003',
    title: 'Controlled Substances & Narcotics Handling (Schedule II/III)',
    category: 'Controlled Substances',
    version: 'v4.0',
    lastReviewed: '2026-01-05',
    reviewCycle: 'Quarterly',
    status: 'Active',
    summary: 'Stringent compliance protocols for ordering, physical custody, double-signature dispensing, and register reconciliation.',
    steps: [
      'Store all controlled substances in a bolted, double-locked narcotic safe accessible only by licensed pharmacists.',
      'Dispense only against original handwritten prescription with NMRA prescriber registration and patient National ID (NIC).',
      'Record every transaction in the Dangerous Drugs Register: Date, Patient Name, NIC, Prescriber, Batch, Balance.',
      'Perform daily physical count verification against ledger balances at shift handover.',
      'Report any discrepancy exceeding 0 units to the Superintendent Pharmacist and NMRA within 24 hours.'
    ]
  },
  {
    id: 'SOP-RECALL-004',
    title: 'Product Recall & Defective Medicines Quarantine',
    category: 'NMRA Compliance & Recalls',
    version: 'v1.4',
    lastReviewed: '2025-11-20',
    reviewCycle: 'Annual',
    status: 'Active',
    summary: 'Immediate action plan upon receipt of NMRA alert, manufacturer recall notice, or batch quality defect.',
    steps: [
      'Log NMRA or supplier recall bulletin in the Regulatory Communications Log within 1 hour of receipt.',
      'Instantly flag and lock batch number in Happy Health Inventory System to prevent dispensing.',
      'Physical removal of all remaining batch units from dispensing shelves to Red Quarantine Zone.',
      'Generate Dispensed History report to identify and notify patients who received affected batch.',
      'Prepare stock return manifest and certificate of destruction or return to licensed distributor.'
    ]
  },
  {
    id: 'SOP-EMERG-005',
    title: 'Chemical & Cytotoxic Spill Emergency Response',
    category: 'Emergency & Safety',
    version: 'v2.0',
    lastReviewed: '2025-10-12',
    reviewCycle: 'Annual',
    status: 'Active',
    summary: 'Procedures for containing hazardous substance breakages, protecting staff, and decontamination.',
    steps: [
      'Evacuate immediate 3-meter perimeter and alert neighboring staff.',
      'Don PPE from Pharmacy Emergency Spill Kit (Nitrile gloves, safety goggles, FFP3 respirator, disposable gown).',
      'Cover liquid spill with neutralizing absorbent pads starting from outer perimeter inward.',
      'Scoop residue into designated hazardous biohazard yellow waste bag.',
      'Cleanse surface with disinfectant solution twice and ventilate room for 30 minutes before re-entry.'
    ]
  }
];

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('drugs'); // 'drugs' | 'sops' | 'storage'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [drugsList, setDrugsList] = useState(initialDrugs);
  const [sopsList] = useState(initialSOPs);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [isAddDrugModalOpen, setIsAddDrugModalOpen] = useState(false);

  // New Drug Form State
  const [newDrug, setNewDrug] = useState({
    brandName: '',
    genericName: '',
    category: 'Analgesics & Antipyretics',
    dosage: '',
    storage: 'Store below 25°C',
    contraindications: '',
    precautions: '',
    pregnancyCategory: 'Category B',
    dispensingChecklist: ''
  });

  // Filtered drugs
  const filteredDrugs = useMemo(() => {
    return drugsList.filter(d => {
      const matchSearch = 
        d.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [drugsList, searchQuery, selectedCategory]);

  // Filtered SOPs
  const filteredSOPs = useMemo(() => {
    return sopsList.filter(s => {
      const matchSearch = 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [sopsList, searchQuery, selectedCategory]);

  const handleAddDrug = (e) => {
    e.preventDefault();
    if (!newDrug.brandName || !newDrug.genericName) return;

    const checklistItems = newDrug.dispensingChecklist
      ? newDrug.dispensingChecklist.split('\n').filter(Boolean)
      : ['Confirm patient identity', 'Advise on compliance'];

    const entry = {
      id: `DRUG-${String(drugsList.length + 1).padStart(3, '0')}`,
      ...newDrug,
      dispensingChecklist: checklistItems
    };

    setDrugsList([entry, ...drugsList]);
    setIsAddDrugModalOpen(false);
    setNewDrug({
      brandName: '',
      genericName: '',
      category: 'Analgesics & Antipyretics',
      dosage: '',
      storage: 'Store below 25°C',
      contraindications: '',
      precautions: '',
      pregnancyCategory: 'Category B',
      dispensingChecklist: ''
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b border-[#DAE5DE] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-[#EBF5EE] text-[#16734B] tracking-wider">
              Happy Health Clinical MIS
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              NMRA Compliant
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#142D23]">Central Knowledge Base & SOPs</h1>
          <p className="text-[#52665D] font-medium mt-1 flex items-center gap-1.5 text-sm">
            Clinical drug monographs, dispensing protocols, standard operating procedures, and cold-chain guidelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'drugs' && (
            <button
              onClick={() => setIsAddDrugModalOpen(true)}
              className="px-4 py-2 bg-[#16734B] hover:bg-[#10573A] text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Drug Monograph
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#DAE5DE] shadow-sm">
          <p className="text-xs font-bold text-[#52665D] uppercase tracking-wider">Active Monographs</p>
          <p className="text-2xl font-black text-[#142D23] mt-1">{drugsList.length} Formulary Drugs</p>
          <span className="text-[11px] text-[#16734B] font-bold mt-1 inline-block">Updated to SLNF 2026</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DAE5DE] shadow-sm">
          <p className="text-xs font-bold text-[#52665D] uppercase tracking-wider">Active Pharmacy SOPs</p>
          <p className="text-2xl font-black text-[#142D23] mt-1">{sopsList.length} Documented SOPs</p>
          <span className="text-[11px] text-[#16734B] font-bold mt-1 inline-block">100% Audit Readiness</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DAE5DE] shadow-sm">
          <p className="text-xs font-bold text-[#52665D] uppercase tracking-wider">Cold Chain Standards</p>
          <p className="text-2xl font-black text-[#2865A0] mt-1">2.0°C – 8.0°C</p>
          <span className="text-[11px] text-[#2865A0] font-bold mt-1 inline-block">Calibrated Digital Logger</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#DAE5DE] shadow-sm">
          <p className="text-xs font-bold text-[#52665D] uppercase tracking-wider">Regulatory Compliance</p>
          <p className="text-2xl font-black text-[#986400] mt-1">Grade A</p>
          <span className="text-[11px] text-[#986400] font-bold mt-1 inline-block">NMRA Pharmacy License #941</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#DAE5DE] gap-2">
        <button
          onClick={() => { setActiveTab('drugs'); setSelectedCategory('All'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'drugs'
              ? 'bg-white border-t-2 border-t-[#16734B] border-x border-[#DAE5DE] text-[#16734B] shadow-sm -mb-[1px]'
              : 'text-[#52665D] hover:text-[#142D23] hover:bg-[#EBF5EE]/50'
          }`}
        >
          <Pill className="w-4 h-4" />
          Clinical Drug Guidelines
          <span className="text-xs bg-[#EBF5EE] text-[#16734B] px-2 py-0.5 rounded-full font-black">
            {drugsList.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('sops'); setSelectedCategory('All'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'sops'
              ? 'bg-white border-t-2 border-t-[#16734B] border-x border-[#DAE5DE] text-[#16734B] shadow-sm -mb-[1px]'
              : 'text-[#52665D] hover:text-[#142D23] hover:bg-[#EBF5EE]/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Standard Operating Procedures (SOPs)
          <span className="text-xs bg-[#EBF5EE] text-[#16734B] px-2 py-0.5 rounded-full font-black">
            {sopsList.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('storage'); setSelectedCategory('All'); }}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'storage'
              ? 'bg-white border-t-2 border-t-[#16734B] border-x border-[#DAE5DE] text-[#16734B] shadow-sm -mb-[1px]'
              : 'text-[#52665D] hover:text-[#142D23] hover:bg-[#EBF5EE]/50'
          }`}
        >
          <Snowflake className="w-4 h-4" />
          Cold-Chain & Storage Protocols
        </button>
      </div>

      {/* ================= TAB 1: CLINICAL DRUG GUIDELINES ================= */}
      {activeTab === 'drugs' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#52665D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Brand Name, Generic Name, or Class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DAE5DE] rounded-xl text-sm font-semibold text-[#142D23] focus:border-[#16734B] focus:ring-2 focus:ring-[#EBF5EE] outline-none transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Analgesics & Antipyretics', 'Antibiotics & Anti-infectives', 'Cardiovascular', 'Endocrine & Antidiabetic', 'Gastrointestinal', 'Respiratory'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-[#16734B] text-white border-[#16734B]'
                      : 'bg-white text-[#52665D] border-[#DAE5DE] hover:bg-[#EBF5EE]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Drugs List / Table */}
          <div className="bg-white rounded-2xl border border-[#DAE5DE] shadow-sm overflow-hidden">
            <div className="divide-y divide-[#DAE5DE]">
              {filteredDrugs.map((drug) => (
                <div key={drug.id} className="p-5 hover:bg-[#F7FAF8] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-black text-[#16734B] bg-[#EBF5EE] px-2 py-0.5 rounded">
                          {drug.id}
                        </span>
                        <h3 className="text-lg font-black text-[#142D23]">{drug.brandName}</h3>
                        <span className="text-xs font-bold text-[#52665D] italic">
                          ({drug.genericName})
                        </span>
                        <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {drug.category}
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {drug.pregnancyCategory}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#142D23] mt-2 pt-2 border-t border-[#DAE5DE]/50">
                        <div>
                          <strong className="text-[#52665D] block">Standard Dosage & Admin:</strong>
                          <span className="font-semibold">{drug.dosage}</span>
                        </div>
                        <div>
                          <strong className="text-[#52665D] block">Storage Specification:</strong>
                          <span className="font-semibold text-emerald-800">{drug.storage}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#142D23] mt-1">
                        <div>
                          <strong className="text-red-700 block">Contraindications:</strong>
                          <span className="text-[#52665D]">{drug.contraindications}</span>
                        </div>
                        <div>
                          <strong className="text-amber-800 block">Clinical Precautions:</strong>
                          <span className="text-[#52665D]">{drug.precautions}</span>
                        </div>
                      </div>

                      {/* Dispensing Checklist Chips */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[#52665D] mr-1">Rx Checklist:</span>
                        {drug.dispensingChecklist.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#EBF5EE] text-[#16734B] px-2 py-0.5 rounded-md border border-[#DAE5DE]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#16734B]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex lg:flex-col items-center gap-2">
                      <button
                        onClick={() => setSelectedDrug(drug)}
                        className="px-3 py-1.5 bg-[#EBF5EE] hover:bg-[#16734B] hover:text-white text-[#16734B] rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 w-full justify-center"
                      >
                        <FileText className="w-3.5 h-3.5" /> Full Monograph
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDrugs.length === 0 && (
                <div className="p-12 text-center text-[#52665D]">
                  <Pill className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-bold">No drug monographs match your search criteria.</p>
                  <p className="text-xs mt-1">Try searching for other brand names like Panadol, Amoxil, Losec, or Lipitor.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: STANDARD OPERATING PROCEDURES ================= */}
      {activeTab === 'sops' && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#52665D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search SOP by ID, title, or protocol keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DAE5DE] rounded-xl text-sm font-semibold text-[#142D23] focus:border-[#16734B] focus:ring-2 focus:ring-[#EBF5EE] outline-none transition-all shadow-sm"
            />
          </div>

          {/* SOP Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSOPs.map((sop) => (
              <div
                key={sop.id}
                className="bg-white rounded-2xl border border-[#DAE5DE] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-[#EBF5EE] text-[#16734B]">
                      {sop.id}
                    </span>
                    <span className="text-[11px] font-bold text-[#52665D] bg-slate-100 px-2 py-0.5 rounded">
                      {sop.version} · {sop.status}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#142D23] mb-1 leading-snug">
                    {sop.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#16734B] mb-2">{sop.category}</p>
                  <p className="text-xs text-[#52665D] line-clamp-2 mb-4 leading-relaxed">
                    {sop.summary}
                  </p>

                  <div className="space-y-1.5 pt-3 border-t border-[#DAE5DE]/50">
                    <p className="text-[11px] font-bold text-[#142D23] uppercase tracking-wider">Protocol Steps Preview:</p>
                    {sop.steps.slice(0, 3).map((st, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#52665D]">
                        <span className="w-4 h-4 rounded-full bg-[#EBF5EE] text-[#16734B] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="line-clamp-1">{st}</span>
                      </div>
                    ))}
                    {sop.steps.length > 3 && (
                      <p className="text-[11px] font-bold text-[#16734B] pl-6">
                        + {sop.steps.length - 3} more procedural steps
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#DAE5DE] flex items-center justify-between text-xs font-medium text-[#52665D]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Reviewed: {sop.lastReviewed}
                  </span>
                  <button
                    onClick={() => setSelectedSOP(sop)}
                    className="font-bold text-[#16734B] hover:text-[#10573A] flex items-center gap-1 cursor-pointer"
                  >
                    View Protocol <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: COLD-CHAIN & STORAGE PROTOCOLS ================= */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Cold Chain Box */}
            <div className="bg-white rounded-2xl border-2 border-teal-200 p-6 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 mb-3">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-teal-950 mb-1">Cold Chain (2°C to 8°C)</h3>
              <p className="text-xs font-semibold text-teal-800 mb-3">Biologicals, Insulins & Vaccines</p>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Insulins (Actrapid, Mixtard, Lantus, Humalog)</li>
                <li>• Reconstituted Antibiotic Suspensions (Amoxicillin, Augmentin)</li>
                <li>• Vaccines (Tetanus, Influenza, Rabies, Hepatitis B)</li>
                <li>• Eye Drops (Latanoprost, Chloramphenicol drops)</li>
              </ul>
              <div className="mt-4 p-2.5 bg-teal-50 rounded-lg text-xs font-bold text-teal-900 border border-teal-200">
                Log twice daily: 08:30 and 16:30. Never store on refrigerator door shelves.
              </div>
            </div>

            {/* Controlled Room Temp Box */}
            <div className="bg-white rounded-2xl border-2 border-[#16734B]/30 p-6 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] flex items-center justify-center text-[#16734B] mb-3">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#142D23] mb-1">Controlled Room Temp (15°C to 25°C)</h3>
              <p className="text-xs font-semibold text-[#16734B] mb-3">Solid Oral Dosage Forms</p>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Paracetamol, Ibuprofen, Diclofenac tablets</li>
                <li>• Antihypertensives (Losartan, Amlodipine, Enalapril)</li>
                <li>• Oral Antidiabetics (Metformin, Gliclazide)</li>
                <li>• Inhalers & Aerosols (Salbutamol, Seretide)</li>
              </ul>
              <div className="mt-4 p-2.5 bg-[#EBF5EE] rounded-lg text-xs font-bold text-[#16734B] border border-[#DAE5DE]">
                Maintain relative humidity below 60%. Continuous AC cooling during operation.
              </div>
            </div>

            {/* Controlled & Narcotics Safe */}
            <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-amber-950 mb-1">Narcotics Double-Lock Safe</h3>
              <p className="text-xs font-semibold text-amber-800 mb-3">Schedule II & III Controlled Substances</p>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>• Morphine Sulfate (Oral Solution, Ampoules)</li>
                <li>• Tramadol, Fentanyl Transdermal patches</li>
                <li>• Benzodiazepines (Diazepam, Lorazepam, Clonazepam)</li>
                <li>• Pethidine, Codeine Phosphate</li>
              </ul>
              <div className="mt-4 p-2.5 bg-amber-50 rounded-lg text-xs font-bold text-amber-900 border border-amber-200">
                Key custody exclusively with Supervising Pharmacist. Discrepancy tolerance = 0.
              </div>
            </div>
          </div>

          {/* Emergency Excursion Protocol Card */}
          <div className="bg-[#F7FAF8] rounded-2xl border border-[#DAE5DE] p-6">
            <h3 className="text-base font-black text-[#142D23] flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Power Outage & Temperature Excursion Protocol
            </h3>
            <p className="text-xs text-[#52665D] leading-relaxed mb-4">
              In case of utility grid failure, the automated standby generator starts within 45 seconds. If generator fails:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-[#142D23]">
              <div className="bg-white p-3 rounded-xl border border-[#DAE5DE]">
                <strong className="block text-[#16734B] mb-1">Phase 1: First 30 Mins</strong>
                Keep refrigerator doors strictly sealed. Thermal mass keeps inside below 8°C for up to 4 hours.
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#DAE5DE]">
                <strong className="block text-[#16734B] mb-1">Phase 2: After 2 Hours</strong>
                Transfer biologicals to emergency cool-boxes pre-packed with conditioned water ice packs.
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#DAE5DE]">
                <strong className="block text-[#16734B] mb-1">Phase 3: Re-powering</strong>
                Confirm continuous 2-8°C stability for 60 minutes before returning stocks to permanent refrigeration.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL DRUG MONOGRAPH DETAIL ================= */}
      {selectedDrug && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#DAE5DE] pb-3">
              <div>
                <span className="text-xs font-black text-[#16734B] bg-[#EBF5EE] px-2 py-0.5 rounded">
                  {selectedDrug.id}
                </span>
                <h2 className="text-2xl font-black text-[#142D23] mt-1">{selectedDrug.brandName}</h2>
                <p className="text-xs font-bold text-[#52665D]">Generic: {selectedDrug.genericName}</p>
              </div>
              <button
                onClick={() => setSelectedDrug(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#142D23]">
              <div>
                <strong className="text-[#52665D] block mb-0.5 uppercase tracking-wide">Category & Classification:</strong>
                <span className="font-semibold text-sm">{selectedDrug.category}</span>
              </div>

              <div>
                <strong className="text-[#52665D] block mb-0.5 uppercase tracking-wide">Standard Dosage Regimen:</strong>
                <p className="bg-[#F7FAF8] p-3 rounded-xl border border-[#DAE5DE] font-semibold">{selectedDrug.dosage}</p>
              </div>

              <div>
                <strong className="text-emerald-800 block mb-0.5 uppercase tracking-wide">Storage Requirements:</strong>
                <p className="bg-[#EBF5EE] p-3 rounded-xl border border-[#DAE5DE] font-bold text-[#16734B]">{selectedDrug.storage}</p>
              </div>

              <div>
                <strong className="text-red-700 block mb-0.5 uppercase tracking-wide">Contraindications:</strong>
                <p className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-900 font-medium">{selectedDrug.contraindications}</p>
              </div>

              <div>
                <strong className="text-amber-800 block mb-0.5 uppercase tracking-wide">Clinical Precautions:</strong>
                <p className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-900 font-medium">{selectedDrug.precautions}</p>
              </div>

              <div>
                <strong className="text-[#142D23] block mb-1 uppercase tracking-wide">Mandatory Dispensing Verification Checklist:</strong>
                <div className="space-y-1">
                  {selectedDrug.dispensingChecklist.map((ch, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-[#F7FAF8] rounded-lg border border-[#DAE5DE]">
                      <CheckCircle2 className="w-4 h-4 text-[#16734B]" />
                      <span className="font-semibold">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DAE5DE] flex justify-end">
              <button
                onClick={() => setSelectedDrug(null)}
                className="px-4 py-2 bg-[#16734B] hover:bg-[#10573A] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Monograph
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: FULL SOP PROTOCOL DETAIL ================= */}
      {selectedSOP && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#DAE5DE] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-[#EBF5EE] text-[#16734B]">
                    {selectedSOP.id}
                  </span>
                  <span className="text-xs font-bold text-[#52665D]">
                    {selectedSOP.version} · {selectedSOP.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#142D23]">{selectedSOP.title}</h2>
                <p className="text-xs font-bold text-[#16734B]">{selectedSOP.category}</p>
              </div>
              <button
                onClick={() => setSelectedSOP(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#142D23]">
              <div>
                <strong className="text-[#52665D] block mb-0.5 uppercase tracking-wide">Scope & Purpose:</strong>
                <p className="bg-[#F7FAF8] p-3 rounded-xl border border-[#DAE5DE] font-medium leading-relaxed">
                  {selectedSOP.summary}
                </p>
              </div>

              <div>
                <strong className="text-[#142D23] block mb-2 uppercase tracking-wide">Step-by-Step Operating Procedure:</strong>
                <div className="space-y-2">
                  {selectedSOP.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#DAE5DE]">
                      <span className="w-5 h-5 rounded-full bg-[#16734B] text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-xs text-[#142D23] leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#EBF5EE] rounded-xl border border-[#DAE5DE] text-[11px] text-[#142D23] flex items-center justify-between">
                <span>Last reviewed: {selectedSOP.lastReviewed}</span>
                <span>Review Cycle: {selectedSOP.reviewCycle}</span>
                <span className="font-bold text-[#16734B]">Authorized by Superintendent Pharmacist</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DAE5DE] flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-[#DAE5DE] text-[#142D23] font-bold text-xs rounded-xl hover:bg-[#F7FAF8] cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Print / Save SOP
              </button>
              <button
                onClick={() => setSelectedSOP(null)}
                className="px-4 py-2 bg-[#16734B] hover:bg-[#10573A] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW DRUG MONOGRAPH ================= */}
      {isAddDrugModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DAE5DE] pb-3">
              <h2 className="text-xl font-black text-[#142D23]">Add Clinical Drug Monograph</h2>
              <button
                onClick={() => setIsAddDrugModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDrug} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#142D23] block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625mg"
                    value={newDrug.brandName}
                    onChange={(e) => setNewDrug({ ...newDrug, brandName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#142D23] block mb-1">Generic Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Co-amoxiclav"
                    value={newDrug.genericName}
                    onChange={(e) => setNewDrug({ ...newDrug, genericName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#142D23] block mb-1">Therapeutic Class</label>
                  <select
                    value={newDrug.category}
                    onChange={(e) => setNewDrug({ ...newDrug, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                  >
                    <option>Analgesics & Antipyretics</option>
                    <option>Antibiotics & Anti-infectives</option>
                    <option>Cardiovascular</option>
                    <option>Endocrine & Antidiabetic</option>
                    <option>Gastrointestinal</option>
                    <option>Respiratory</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#142D23] block mb-1">Pregnancy Risk Category</label>
                  <select
                    value={newDrug.pregnancyCategory}
                    onChange={(e) => setNewDrug({ ...newDrug, pregnancyCategory: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                  >
                    <option>Category A - Controlled studies show no risk</option>
                    <option>Category B - No evidence of risk in humans</option>
                    <option>Category C - Risk cannot be ruled out</option>
                    <option>Category D - Positive evidence of risk</option>
                    <option>Category X - Strictly contraindicated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#142D23] block mb-1">Standard Dosage & Admin</label>
                <input
                  type="text"
                  placeholder="e.g. 1 tablet every 12 hours with meals"
                  value={newDrug.dosage}
                  onChange={(e) => setNewDrug({ ...newDrug, dosage: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#142D23] block mb-1">Storage Condition</label>
                <input
                  type="text"
                  placeholder="e.g. Store below 25°C in dry place"
                  value={newDrug.storage}
                  onChange={(e) => setNewDrug({ ...newDrug, storage: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#142D23] block mb-1">Contraindications</label>
                <textarea
                  rows={2}
                  placeholder="List absolute and relative contraindications..."
                  value={newDrug.contraindications}
                  onChange={(e) => setNewDrug({ ...newDrug, contraindications: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#142D23] block mb-1">Precautions & Warnings</label>
                <textarea
                  rows={2}
                  placeholder="Special warnings, renal/hepatic adjustments..."
                  value={newDrug.precautions}
                  onChange={(e) => setNewDrug({ ...newDrug, precautions: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                />
              </div>

              <div>
                <label className="font-bold text-[#142D23] block mb-1">Dispensing Checklist (1 item per line)</label>
                <textarea
                  rows={2}
                  placeholder="Check allergy history&#10;Advise taking with water&#10;Complete course"
                  value={newDrug.dispensingChecklist}
                  onChange={(e) => setNewDrug({ ...newDrug, dispensingChecklist: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-[#DAE5DE] rounded-xl font-medium outline-none focus:border-[#16734B]"
                />
              </div>

              <div className="pt-3 border-t border-[#DAE5DE] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDrugModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#16734B] hover:bg-[#10573A] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
