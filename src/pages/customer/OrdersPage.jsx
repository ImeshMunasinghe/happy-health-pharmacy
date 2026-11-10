import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  Upload, ClipboardList, Clock, Sparkles, TrendingUp,
  Zap, Heart, AlertCircle, CheckCircle, Lightbulb,
  FileText, Search, Package, Check, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { C, FONT } from '../../components/profile/profileTheme';
import PageBanner from '../../components/profile/PageBanner';
import OrderCard from '../../components/orders/OrderCard';
import { ROUTES } from '../../components/utils/constants';
import {
  MOCK_CUSTOMER_PRESCRIPTION,
  MOCK_CUSTOMER_PAST_ORDERS,
} from '../../data/mockDashboardData';

const API_BASE = `${import.meta.env.VITE_API_URL_RAILWAY && import.meta.env.VITE_API_URL_RAILWAY !== 'undefined' ? import.meta.env.VITE_API_URL_RAILWAY : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}/api/customer-orders`;

// ─── 4-Step Prescription Stepper Component ─────────────────────────────────────
function PrescriptionStatusStepper({ latestPrescription }) {
  if (!latestPrescription) return null;

  const rawStatus = (latestPrescription.orderStatus || latestPrescription.status || 'Pending').toLowerCase();

  // Determine current active step (1 to 4)
  let activeStep = 1;
  if (['pending', 'submitted'].includes(rawStatus)) {
    activeStep = 1;
  } else if (['processing', 'review', 'under review', 'reviewing'].includes(rawStatus)) {
    activeStep = 2;
  } else if (['approved', 'ready', 'ready for pickup', 'ready to collect'].includes(rawStatus)) {
    activeStep = 3;
  } else if (['dispensed', 'completed', 'paid'].includes(rawStatus)) {
    activeStep = 4;
  }

  const steps = [
    { id: 1, title: 'Submitted', desc: 'Prescription uploaded', icon: FileText },
    { id: 2, title: 'Under Review', desc: 'Pharmacist verification', icon: Search },
    { id: 3, title: 'Ready for Pickup', desc: 'Medication prepared', icon: CheckCircle },
    { id: 4, title: 'Dispensed', desc: 'Handed over to patient', icon: Package },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#DAE5DE] shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16734B] bg-[#EBF5EE] px-2.5 py-0.5 rounded-md">
            Live Dispensing Tracker
          </span>
          <h3 className="text-lg font-bold text-[#142D23] mt-1">
            Prescription #{latestPrescription.id?.slice(-8) || 'Active'}
          </h3>
        </div>
        <div className="text-xs text-[#52665D]">
          Current Status: <strong className="text-[#16734B] capitalize">{rawStatus}</strong>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-[#DAE5DE] -translate-y-1/2 z-0">
          <div
            className="h-full bg-[#16734B] transition-all duration-500"
            style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {steps.map((step) => {
            const isCompleted = step.id < activeStep;
            const isCurrent = step.id === activeStep;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex md:flex-col items-center gap-3 md:text-center">
                {/* Circle Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#16734B] text-white shadow-md'
                      : isCurrent
                      ? 'bg-[#EBF5EE] text-[#16734B] border-2 border-[#16734B] ring-4 ring-[#16734B]/15 shadow-md'
                      : 'bg-white text-[#52665D] border border-[#DAE5DE]'
                  }`}
                >
                  {isCompleted ? <Check size={20} strokeWidth={2.5} /> : <StepIcon size={20} />}
                </div>

                {/* Step Info */}
                <div>
                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-[#16734B]' : 'text-[#142D23]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-[#52665D] mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { currentUser } = useAuth();
  const [orders, setOrders]               = useState([]);
  const [prescriptions, setPrescriptions] = useState([MOCK_CUSTOMER_PRESCRIPTION, ...MOCK_CUSTOMER_PAST_ORDERS]);
  const [loading, setLoading]             = useState(false);
  const [activeTab, setActiveTab]         = useState('prescriptions');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    let unsubPres = () => {};

    const fetchOrders = async () => {
      try {
        const token = await currentUser.getIdToken();
        const res = await fetch(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const tagged = data.map(d => ({
          ...d,
          type: 'regular',
          orderStatus: d.orderStatus || 'pending',
        }));
        if (tagged.length > 0) setOrders(tagged);
      } catch (err) {
        console.warn('Orders fetched from backend failed; retaining baseline view:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const qPres = query(
      collection(db, 'prescriptions'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    unsubPres = onSnapshot(qPres, (snap) => {
      if (!snap.empty) {
        const all = snap.docs.map(d => {
          const p = d.data();
          return {
            id: d.id,
            ...p,
            type: 'prescription',
            customerName:  p.customerName || 'Prescription Upload',
            phone:         p.customerPhone,
            address:       p.customerAddress,
            orderStatus:   p.status || 'Pending',
            paymentMethod: p.medications?.length > 0 ? 'Pharmacy Quote' : 'Pending Review',
            paymentStatus: p.status === 'Paid' ? 'paid' : 'pending',
            types: (p.medications || p.orderItems || []).map(m => ({
              name:     m.name,
              quantity: m.qty,
              price:    m.price,
              id:       'RX-ITEM',
            })),
            createdAt: p.createdAt,
          };
        });
        setPrescriptions(all);
      }
    });

    return () => { unsubPres(); };
  }, [currentUser]);

  const prescriptionIds = new Set(prescriptions.map(p => p.id));
  const visibleOrders = orders.filter((item) => {
    if (item.rxId && prescriptionIds.has(item.rxId)) return false;
    return true;
  });

  const latestPrescription = prescriptions.length > 0 ? prescriptions[0] : null;

  return (
    <div className="min-h-screen bg-[#F7FAF8]" style={{ fontFamily: FONT.body }}>

      <PageBanner
        title="Prescriptions & Dispensing"
        subtitle="Track live preparation and history of all doctor prescriptions submitted to Happy Health."
      >
        <div className="flex flex-wrap gap-3 mt-2 justify-center">
          <button
            onClick={() => navigate(ROUTES.CUSTOMER_PRESCRIPTION)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl bg-white text-[#16734B] border-none cursor-pointer hover:bg-[#EBF5EE] transition shadow-md"
          >
            <Upload size={14} /> Upload Prescription
          </button>
        </div>
      </PageBanner>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── LIVE PRESCRIPTION STEPPER ── */}
        <PrescriptionStatusStepper latestPrescription={latestPrescription} />

        {/* ── SUMMARY STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Prescriptions', value: prescriptions.length, icon: ClipboardList, color: '#16734B', bg: '#EBF5EE' },
            { label: 'Pending Review', value: prescriptions.filter(p => p.orderStatus === 'Pending').length, icon: Clock, color: '#986400', bg: 'rgba(152,100,0,0.08)' },
            { label: 'Approved & Ready', value: prescriptions.filter(p => p.orderStatus === 'Approved').length, icon: CheckCircle, color: '#16734B', bg: '#EBF5EE' },
            { label: 'Dispensed Total', value: prescriptions.filter(p => p.orderStatus === 'Dispensed').length, icon: Package, color: '#2865A0', bg: 'rgba(40,101,160,0.08)' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-[#DAE5DE] shadow-sm flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <p className="text-2xl font-black text-[#142D23]">{value}</p>
                <p className="text-xs font-semibold text-[#52665D] mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── TAB SELECTOR & LIST ── */}
        <div className="bg-white rounded-2xl border border-[#DAE5DE] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DAE5DE]">
            <div>
              <h3 className="text-xl font-bold text-[#142D23]">My Pharmacy History</h3>
              <p className="text-xs text-[#52665D] mt-0.5">View all clinical reviews, approved quotes, and dispensed medications.</p>
            </div>

            <div className="flex gap-2 p-1 bg-[#F7FAF8] rounded-xl border border-[#DAE5DE]">
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition border-none cursor-pointer ${
                  activeTab === 'prescriptions'
                    ? 'bg-[#16734B] text-white shadow-sm'
                    : 'bg-transparent text-[#52665D] hover:text-[#142D23]'
                }`}
              >
                Prescriptions ({prescriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition border-none cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#16734B] text-white shadow-sm'
                    : 'bg-transparent text-[#52665D] hover:text-[#142D23]'
                }`}
              >
                Direct Requests ({visibleOrders.length})
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="space-y-4">
            {activeTab === 'prescriptions' ? (
              prescriptions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#DAE5DE] rounded-2xl bg-[#F7FAF8]">
                  <ClipboardList size={36} className="mx-auto text-[#52665D] mb-3 opacity-50" />
                  <p className="text-base font-bold text-[#142D23]">No prescriptions uploaded yet</p>
                  <p className="text-xs text-[#52665D] mt-1 max-w-sm mx-auto">
                    Upload your doctor prescription to receive a verified price quote and preparation update from our pharmacist.
                  </p>
                  <button
                    onClick={() => navigate(ROUTES.CUSTOMER_PRESCRIPTION)}
                    className="mt-4 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#16734B] text-white hover:bg-[#10573A] border-none cursor-pointer"
                  >
                    Upload Now
                  </button>
                </div>
              ) : (
                prescriptions.map((p) => <OrderCard key={p.id} order={p} />)
              )
            ) : (
              visibleOrders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#DAE5DE] rounded-2xl bg-[#F7FAF8]">
                  <Package size={36} className="mx-auto text-[#52665D] mb-3 opacity-50" />
                  <p className="text-base font-bold text-[#142D23]">No direct requests</p>
                  <p className="text-xs text-[#52665D] mt-1">Direct medicine orders and inquiries will appear here.</p>
                </div>
              ) : (
                visibleOrders.map((o) => <OrderCard key={o.id} order={o} />)
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
