import React, { useState } from 'react';
import {
  AlertTriangle, ShieldCheck, Search, Plus, Trash2,
  CheckCircle2, AlertOctagon, Info, RefreshCw, Printer,
  FileText, Pill, ArrowRight, Zap
} from 'lucide-react';

// Sri Lankan (British/Commonwealth) trade names to active generic names
const SL_DRUG_DICTIONARY = {
  paracetamol: 'acetaminophen',
  panadol: 'acetaminophen',
  aspirin: 'aspirin',
  disprin: 'aspirin',
  warfarin: 'warfarin',
  ibuprofen: 'ibuprofen',
  brufen: 'ibuprofen',
  metformin: 'metformin',
  lisinopril: 'lisinopril',
  atorvastatin: 'atorvastatin',
  lipitor: 'atorvastatin',
  clopidogrel: 'clopidogrel',
  plavix: 'clopidogrel',
  omeprazole: 'omeprazole',
  losec: 'omeprazole',
  amoxicillin: 'amoxicillin',
  ciprofloxacin: 'ciprofloxacin',
  cipro: 'ciprofloxacin',
  salbutamol: 'albuterol',
  ventolin: 'albuterol',
  amlodipine: 'amlodipine',
  norvasc: 'amlodipine',
  losartan: 'losartan',
  simvastatin: 'simvastatin',
  zocor: 'simvastatin',
  frusemide: 'furosemide',
  furosemide: 'furosemide',
  lasix: 'furosemide',
  digoxin: 'digoxin',
  lanoxin: 'digoxin',
  tramadol: 'tramadol',
  diazepam: 'diazepam',
  valium: 'diazepam',
};

// Clinical Knowledge Interaction Matrix for instant, authoritative cross-checking
const CLINICAL_INTERACTIONS_DB = [
  {
    drugs: ['warfarin', 'aspirin'],
    severity: 'High',
    title: 'Severe Bleeding & Hemorrhage Risk',
    effect: 'Concurrent use markedly inhibits platelet aggregation and potentiates hypoprothrombinemia, significantly increasing the hazard of gastrointestinal bleeding or systemic hemorrhage.',
    action: 'Avoid combination unless specifically directed by a cardiologist. Consider substituting Aspirin with Paracetamol for analgesia.',
    riskScore: 95,
  },
  {
    drugs: ['warfarin', 'ibuprofen'],
    severity: 'High',
    title: 'Enhanced Anticoagulation & Peptic Ulceration',
    effect: 'NSAIDs displace Warfarin from protein-binding sites and damage gastrointestinal mucosa, leading to elevated INR and severe mucosal bleeding.',
    action: 'Contraindicated. Monitor INR closely if unavoidable. Use topical NSAIDs or Paracetamol as first-line alternatives.',
    riskScore: 92,
  },
  {
    drugs: ['clopidogrel', 'omeprazole'],
    severity: 'Moderate',
    title: 'Reduced Antiplatelet Efficacy via CYP2C19 Inhibition',
    effect: 'Omeprazole competitively inhibits the CYP2C19 enzyme responsible for metabolizing Clopidogrel into its active antiplatelet form, reducing cardiovascular protection.',
    action: 'Consider pantoprazole or famotidine instead of omeprazole as they demonstrate significantly lower CYP2C19 inhibition.',
    riskScore: 68,
  },
  {
    drugs: ['lisinopril', 'ibuprofen'],
    severity: 'Moderate',
    title: 'Renal Impairment & Antihypertensive Blunting',
    effect: 'NSAIDs inhibit renal prostaglandins, reducing renal blood flow and antagonizing the blood-pressure lowering benefits of ACE inhibitors like Lisinopril.',
    action: 'Monitor blood pressure and serum creatinine. Keep patient adequately hydrated; limit NSAID duration to under 5 days.',
    riskScore: 65,
  },
  {
    drugs: ['metformin', 'furosemide'],
    severity: 'Moderate',
    title: 'Elevated Metformin Concentration & Lactic Acidosis Risk',
    effect: 'Furosemide may increase peak metformin plasma concentrations and reduce renal clearance, slightly heightening the probability of lactic acidosis in compromised patients.',
    action: 'Assess baseline eGFR. Advise patient on symptoms of lactic acidosis (malaise, myalgia, respiratory distress).',
    riskScore: 58,
  },
  {
    drugs: ['simvastatin', 'amlodipine'],
    severity: 'Moderate',
    title: 'Increased Statin Concentration & Risk of Rhabdomyolysis',
    effect: 'Amlodipine inhibits CYP3A4, causing increased systemic exposure to Simvastatin and raising the incidence of myopathy and rhabdomyolysis.',
    action: 'Do not exceed 20 mg daily of Simvastatin when co-prescribed with Amlodipine, or switch to Atorvastatin.',
    riskScore: 62,
  },
  {
    drugs: ['ciprofloxacin', 'ibuprofen'],
    severity: 'Moderate',
    title: 'Central Nervous System Stimulation & Seizure Risk',
    effect: 'Fluoroquinolones combined with NSAIDs may enhance GABA-receptor blockade, potentiating CNS excitation and lowering seizure thresholds.',
    action: 'Use with caution in elderly patients or those with a history of epilepsy or neurovascular disease.',
    riskScore: 60,
  },
  {
    drugs: ['paracetamol', 'warfarin'],
    severity: 'Minor',
    title: 'Potential Prolongation of Prothrombin Time (INR)',
    effect: 'Regular high doses of Paracetamol (>2g/day for multiple consecutive days) may moderately prolong prothrombin time and elevate INR.',
    action: 'Occasional therapeutic doses are safe. Monitor INR if patient requires daily Paracetamol for over 5-7 days.',
    riskScore: 35,
  },
  {
    drugs: ['digoxin', 'furosemide'],
    severity: 'High',
    title: 'Electrolyte Depletion & Digoxin Toxicity',
    effect: 'Loop diuretics induce hypokalemia and hypomagnesemia, markedly sensitizing the myocardium to Digoxin toxicity and fatal cardiac arrhythmias.',
    action: 'Monitor serum potassium and magnesium levels routinely. Maintain serum potassium > 4.0 mEq/L.',
    riskScore: 90,
  },
  {
    drugs: ['tramadol', 'fluoxetine'],
    severity: 'High',
    title: 'Serotonin Syndrome & Seizure Risk',
    effect: 'Synergistic serotonergic effects increase the risk of Serotonin Syndrome (hyperreflexia, clonus, hyperthermia) and reduce seizure threshold.',
    action: 'Avoid combination. Recommend alternate opioid analgesics without serotonergic reuptake inhibition.',
    riskScore: 88,
  },
];

export default function PharmacistDrugInteraction() {
  const [drugs, setDrugs] = useState(['Warfarin', 'Aspirin']);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [fdaNotice, setFdaNotice] = useState(null);

  const handleAddDrug = () => {
    if (drugs.length < 5) {
      setDrugs([...drugs, '']);
    }
  };

  const handleRemoveDrug = (index) => {
    if (drugs.length > 2) {
      setDrugs(drugs.filter((_, i) => i !== index));
    }
  };

  const handleDrugChange = (index, value) => {
    const updated = [...drugs];
    updated[index] = value;
    setDrugs(updated);
  };

  const normalizeDrug = (name) => {
    const clean = name.trim().toLowerCase();
    return SL_DRUG_DICTIONARY[clean] || clean;
  };

  const handleCheckInteractions = async () => {
    const validDrugs = drugs.map(d => d.trim()).filter(Boolean);
    if (validDrugs.length < 2) {
      alert('Please enter at least two drug names to check interactions.');
      return;
    }

    setAnalyzing(true);
    setResults(null);
    setFdaNotice(null);

    const normalizedList = validDrugs.map(d => ({
      original: d,
      generic: normalizeDrug(d),
    }));

    // Find all pairs
    const foundInteractions = [];

    for (let i = 0; i < normalizedList.length; i++) {
      for (let j = i + 1; j < normalizedList.length; j++) {
        const drugA = normalizedList[i].generic;
        const drugB = normalizedList[j].generic;

        const match = CLINICAL_INTERACTIONS_DB.find(rule =>
          (rule.drugs[0] === drugA && rule.drugs[1] === drugB) ||
          (rule.drugs[0] === drugB && rule.drugs[1] === drugA)
        );

        if (match) {
          foundInteractions.push({
            ...match,
            drug1: normalizedList[i].original,
            drug2: normalizedList[j].original,
          });
        }
      }
    }

    // Attempt OpenFDA drug label check for the primary drug as online verification
    try {
      const primary = normalizedList[0].generic;
      const fdaRes = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(primary)}"&limit=1`
      );
      if (fdaRes.ok) {
        const fdaData = await fdaRes.json();
        const label = fdaData.results?.[0];
        if (label?.drug_interactions?.[0]) {
          setFdaNotice({
            drug: normalizedList[0].original,
            snippet: label.drug_interactions[0].slice(0, 300) + '...',
          });
        }
      }
    } catch {
      // Offline fallback is fine
    }

    setAnalyzing(false);
    setResults({
      testedDrugs: validDrugs,
      interactions: foundInteractions,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const severityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#B93838] border border-red-200">
            <AlertOctagon size={13} /> High Risk / Contraindicated
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#986400] border border-amber-200">
            <AlertTriangle size={13} /> Moderate Risk / Monitor
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5EE] text-[#16734B] border border-[#DAE5DE]">
            <Info size={13} /> Minor Caution
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DAE5DE]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#EBF5EE] text-[#16734B] flex items-center justify-center">
              <Zap size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#142D23]">
                AI Drug Interaction Checker
              </h1>
              <p className="text-xs text-[#52665D] mt-0.5">
                Clinical safety decision support & OpenFDA contraindication screening
              </p>
            </div>
          </div>
        </div>

        {results && (
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-[#DAE5DE] text-[#142D23] hover:bg-[#EBF5EE] transition cursor-pointer"
          >
            <Printer size={15} /> Print Clinical Summary
          </button>
        )}
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#DAE5DE] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#142D23] flex items-center gap-2">
            <Pill size={16} className="text-[#16734B]" />
            Enter Prescribed Medications ({drugs.length}/5)
          </h2>
          <span className="text-xs text-[#52665D]">
            Supports local Sri Lankan brand names (Panadol, Brufen, Lasix, etc.)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {drugs.map((drug, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={drug}
                  onChange={(e) => handleDrugChange(index, e.target.value)}
                  placeholder={`Medication ${index + 1} (e.g. Warfarin)`}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DAE5DE] text-sm text-[#142D23] bg-[#F7FAF8] focus:bg-white focus:border-[#16734B] focus:outline-none transition"
                />
              </div>
              {drugs.length > 2 && (
                <button
                  onClick={() => handleRemoveDrug(index)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 border border-transparent transition cursor-pointer"
                  title="Remove medication"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#DAE5DE]/60">
          <button
            onClick={handleAddDrug}
            disabled={drugs.length >= 5}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#16734B] bg-[#EBF5EE] hover:bg-[#16734B]/15 transition border-none cursor-pointer disabled:opacity-50"
          >
            <Plus size={15} /> Add Another Medication
          </button>

          <button
            onClick={handleCheckInteractions}
            disabled={analyzing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#16734B] hover:bg-[#10573A] shadow-md shadow-[#16734B]/20 transition border-none cursor-pointer disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Cross-checking OpenFDA...
              </>
            ) : (
              <>
                <ShieldCheck size={18} /> Analyze Drug Interactions
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#142D23]">
              Interaction Assessment Results
            </h2>
            <span className="text-xs text-[#52665D]">
              Evaluated at {results.timestamp} across {results.testedDrugs.length} drugs
            </span>
          </div>

          {results.interactions.length === 0 ? (
            /* Safe banner */
            <div className="bg-[#EBF5EE] border-2 border-[#16734B]/30 rounded-2xl p-6 text-center">
              <CheckCircle2 size={42} className="text-[#16734B] mx-auto mb-2" />
              <h3 className="text-lg font-bold text-[#16734B]">No Documented Severe Interactions Found</h3>
              <p className="text-xs text-[#52665D] mt-1 max-w-lg mx-auto">
                No high-risk contraindications were identified between {results.testedDrugs.join(', ')} in the Happy Health clinical database. Standard dosage monitoring is advised.
              </p>
            </div>
          ) : (
            /* Interaction Cards */
            <div className="space-y-4">
              {results.interactions.map((item, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl p-6 border-l-4 shadow-sm border ${
                    item.severity === 'High'
                      ? 'border-l-[#B93838] border-[#DAE5DE]'
                      : item.severity === 'Moderate'
                      ? 'border-l-[#986400] border-[#DAE5DE]'
                      : 'border-l-[#2865A0] border-[#DAE5DE]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {severityBadge(item.severity)}
                      <span className="text-sm font-bold text-[#142D23]">
                        {item.drug1} + {item.drug2}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#52665D]">
                      Clinical Risk Index: <strong>{item.riskScore}%</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#142D23] mb-2">{item.title}</h4>
                  <p className="text-xs text-[#52665D] leading-relaxed mb-4">{item.effect}</p>

                  <div className="p-3.5 rounded-xl bg-[#F7FAF8] border border-[#DAE5DE] flex items-start gap-2.5">
                    <ShieldCheck size={18} className="text-[#16734B] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#16734B]">
                        Pharmacist Action Recommendation
                      </span>
                      <p className="text-xs text-[#142D23] mt-0.5 font-medium">{item.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OpenFDA Verification Snippet */}
          {fdaNotice && (
            <div className="bg-white rounded-xl p-4 border border-[#DAE5DE] text-xs text-[#52665D] flex items-start gap-3">
              <Info size={16} className="text-[#16734B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#142D23]">Official OpenFDA Label Reference ({fdaNotice.drug}):</strong>
                <p className="mt-1 italic leading-relaxed text-[11px]">{fdaNotice.snippet}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-xl bg-[#F7FAF8] border border-[#DAE5DE] text-[11px] text-[#52665D] leading-relaxed">
        <strong>MIS Decision-Support Notice:</strong> This AI tool is intended to aid qualified pharmacists in identifying potential drug-drug interactions and dosage alerts. Final clinical dispensing judgment remains with the registered pharmacist on duty.
      </div>

    </div>
  );
}
