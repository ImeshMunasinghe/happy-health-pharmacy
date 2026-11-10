import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Upload, FileText, User, Phone, MapPin, ExternalLink, FileX, CheckCircle, CreditCard, Pill, Receipt, Clock, ChevronRight, Truck, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { C, FONT, inputStyle }                        from '../../components/profile/profileTheme';
import { SectionCard, SectionLabel, Field,
         SuccessBanner }                              from '../../components/profile/ProfileUI';
import PageBanner from '../../components/profile/PageBanner';
import { StatusBadge, getStatusColor } from '../../components/orders/Orderstatusutils';
import Card                                           from '../../components/Card';

// ── Drop zone ─────────────────────────────────────────────────────────────────
function DropZone({ selectedFile, onFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef(null);

  return (
    <Field icon={<FileText size={11} color="#16734B" />} label="Prescription File">
      <div
        onDragOver={(e)  => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault(); setIsDragging(false);
          const f = e.dataTransfer.files[0]; if (f) onFile(f);
        }}
        onClick={() => ref.current?.click()}
        className="rounded-xl px-5 py-7 text-center cursor-pointer transition-all duration-150 border-2 border-dashed hover:border-[#16734B] hover:bg-[#EBF5EE]/50"
        style={{
          borderColor: isDragging ? '#16734B' : '#DAE5DE',
          background:  isDragging ? '#EBF5EE' : '#F7FAF8',
        }}
      >
        <Upload size={24} color={isDragging ? '#16734B' : '#52665D'} className="mx-auto mb-2.5" />
        {selectedFile
          ? <p className="text-[13px] font-semibold text-[#16734B]">{selectedFile.name}</p>
          : <>
              <p className="text-[13px] font-semibold text-[#142D23]">Drop prescription file here or click to browse</p>
              <p className="text-[11px] mt-1 text-[#52665D]">Supports JPG, PNG, PDF format</p>
            </>
        }
      </div>
      <input type="file" ref={ref} accept="image/*,application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} className="hidden" />
    </Field>
  );
}

// ── Upload form ───────────────────────────────────────────────────────────────
function UploadForm({ onUploaded, userId }) {
  const [file,      setFile]      = useState(null);
  const [name,      setName]      = useState('');
  const [phone,     setPhone]     = useState('');
  const [address,   setAddress]   = useState('');
  const [uploading, setUploading] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [progress,  setProgress]  = useState('');

  const reset = () => { setName(''); setPhone(''); setAddress(''); setProgress(''); };

  const handleUpload = async () => {
    if (!file || !name || !phone) {
      alert('Please fill in name, phone and select a file.');
      return;
    }
    setUploading(true);
    setProgress('Uploading prescription...');

    // Send to your NestJS backend — it handles Firebase Storage upload
    const fd = new FormData();
    fd.append('prescription',    file);
    fd.append('customerName',    name);
    fd.append('customerPhone',   phone);
    fd.append('customerAddress', address);
    if (userId) fd.append('userId', userId);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_RAILWAY && import.meta.env.VITE_API_URL_RAILWAY !== 'undefined' ? import.meta.env.VITE_API_URL_RAILWAY : (import.meta.env.VITE_API_URL || 'http://localhost:5000')}/api/prescriptions/upload`, {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const { prescription } = await res.json();

      // Save to localStorage for tracking
      const localKey = `my_prescriptions_${userId}`;
      const localHistory = JSON.parse(localStorage.getItem(localKey) || '[]');
      localStorage.setItem(localKey, JSON.stringify([prescription.id, ...localHistory]));

      setSuccess(true);
      setProgress('');

      // Pass back to parent with same shape as before
      onUploaded({
        ...prescription,
        createdAt: { toDate: () => new Date() },
      });

      reset();
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      alert(`Upload failed: ${err.message}`);
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  const disabled = !file || uploading;

  return (
    <SectionCard
      icon={<Upload size={16} color={C.accent} />}
      title="Upload Prescription"
      subtitle="Fill in your details and attach your prescription file"
    >
      <Field icon={<User   size={11} color={C.accent} />} label="Name">
        <input style={inputStyle} placeholder="Your full name"    value={name}    onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field icon={<Phone  size={11} color={C.accent} />} label="Phone">
        <input style={inputStyle} placeholder="Your phone number" value={phone}   onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <Field icon={<MapPin size={11} color={C.accent} />} label="Address">
        <textarea
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          placeholder="Your delivery address" rows={3}
          value={address} onChange={(e) => setAddress(e.target.value)}
        />
      </Field>

      <DropZone selectedFile={file} onFile={setFile} />

      {/* Upload progress indicator */}
      {progress && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: C.accentFaint || '#eff6ff',
          border: `1px solid ${C.accent}30`,
        }}>
          <div style={{
            width: 14, height: 14, border: `2px solid ${C.accent}`,
            borderTopColor: 'transparent', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 12, color: C.accent, fontFamily: FONT.body }}>{progress}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={disabled}
        className="flex items-center justify-center gap-2 py-3 rounded-xl border-none text-[13px] font-semibold transition-all"
        style={{
          fontFamily: FONT.body,
          cursor:     disabled ? "not-allowed" : "pointer",
          background: disabled ? C.disabled    : "#16734B",
          color:      disabled ? C.textMuted   : "#ffffff",
          boxShadow:  disabled ? "none"        : "0 4px 12px rgba(22,115,75,0.25)",
        }}
      >
        <Upload size={14} /> {uploading ? 'Uploading to secure storage…' : 'Upload Prescription'}
      </button>

      {success && <SuccessBanner message="Upload successful! Pharmacist has been notified." />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </SectionCard>
  );
}

// ── Prescription history card ─────────────────────────────────────────────────
function PrescriptionCard({ p }) {
  const [showBill, setShowBill] = useState(false);
  const navigate = useNavigate();
  const sc = getStatusColor(p.status);

  return (
    <Card
      id={`rx-${p.id}`}
      header={
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textMuted }}>
            {p.id.slice(-6)} • {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleDateString() : 'Just now'}
          </span>
          <StatusBadge status={p.status} colors={sc} />
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Basic Info */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-bold text-slate-800">{p.customerName}</span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Phone size={10} /> {p.customerPhone}
            </span>
          </div>
          {p.imageUrl && (
            <a href={p.imageUrl} target="_blank" rel="noreferrer" className="text-[#16734B] hover:text-[#10573A] transition-colors">
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        {p.status === 'Pending' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
            <Clock className="text-amber-500" size={18} />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-800 uppercase tracking-tighter">Pending Pharmacist Approval</p>
              <p className="text-[10px] text-amber-600 font-medium">We are checking stock and preparing your verified quote.</p>
            </div>
          </div>
        )}

        {p.status === 'Approved' && !showBill && (
          <button
            onClick={() => setShowBill(true)}
            className="w-full py-3.5 rounded-xl bg-[#16734B] hover:bg-[#10573A] text-white font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition cursor-pointer border-none"
          >
            <Receipt size={18} /> View Quote & Details
          </button>
        )}

        {showBill && p.status === 'Approved' && (
          <div className="p-5 rounded-2xl bg-[#F7FAF8] border-2 border-[#DAE5DE] shadow-inner">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#DAE5DE]">
              <h4 className="font-bold text-[#142D23] text-xs uppercase tracking-widest flex items-center gap-2">
                <Receipt size={14} className="text-[#16734B]" /> Digital Quote
              </h4>
            </div>
            <div className="space-y-2 mb-4">
              {(p.orderItems || p.medications || []).map((m, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">{m.name} <span className="text-[10px] text-slate-400 font-medium">x {m.qty}</span></span>
                  <span className="font-black text-slate-900">Rs. {(m.total || (m.qty * m.price)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-dashed border-[#DAE5DE] mb-6">
              <span className="text-xs font-black text-slate-500 uppercase">Total Amount</span>
              <span className="text-xl font-black text-[#16734B]">Rs. {(p.totalAmount || p.total || 0).toFixed(2)}</span>
            </div>
            
            <div className="p-4 rounded-xl bg-[#EBF5EE] border border-[#16734B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#16734B] flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle size={15} /> Ready for In-Store Collection
                </p>
                <p className="text-xs text-[#52665D] mt-0.5">
                  Present Rx #{p.id.slice(-6)} at the Happy Health counter to collect and pay.
                </p>
              </div>
              <button
                onClick={() => navigate('/customer/orders')}
                className="px-4 py-2 rounded-xl bg-[#16734B] text-white text-xs font-bold uppercase tracking-wider border-none cursor-pointer hover:bg-[#10573A] transition"
              >
                Track Status
              </button>
            </div>
          </div>
        )}

        {p.status === 'Packing' && (
          <div className="p-4 rounded-xl bg-[#EBF5EE] border-2 border-[#16734B]/30 text-[#16734B] text-center shadow-md animate-pulse">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Package size={20} className="text-[#16734B]" />
              <span className="font-black uppercase tracking-widest text-xs">Preparing Medications</span>
            </div>
            <p className="text-[10px] opacity-90 font-bold uppercase tracking-wider">The pharmacist is currently packing your order.</p>
          </div>
        )}

        {(p.status === 'Paid' || p.status === 'Ready to Collect') && (
          <div className="p-4 rounded-xl bg-[#16734B] text-white text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle size={18} />
              <span className="font-black uppercase tracking-widest text-xs">Ready for Pickup</span>
            </div>
            <p className="text-[10px] opacity-90 font-bold uppercase tracking-wider">Order ready at pharmacy counter.</p>
          </div>
        )}

        {(p.status === 'Dispensed' || p.status === 'Delivered') && (
          <div className="p-4 rounded-xl bg-[#EBF5EE] border-2 border-[#16734B]/30 text-[#16734B] text-center shadow-md">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle size={22} className="text-[#16734B]" />
              <span className="font-black uppercase tracking-widest text-xs">Dispensed Successfully</span>
            </div>
            <p className="text-[10px] opacity-90 font-bold uppercase tracking-wider">Medications handed over to patient.</p>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PrescriptionsPage() {
  const { currentUser } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!currentUser?.uid) {
      setPrescriptions([]);
      setLoading(false);
      return;
    }

    const localKey = `my_prescriptions_${currentUser.uid}`;
    const q = query(
      collection(db, 'prescriptions'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const allFirestore = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const localIds = JSON.parse(localStorage.getItem(localKey) || '[]');

      setPrescriptions(prev => {
        const authorizedFirestore = allFirestore.filter(p => {
          if (currentUser?.uid && p.userId === currentUser.uid) return true;
          if (localIds.includes(p.id)) return true;
          return false;
        });

        const pendingOptimistic = prev.filter(p =>
          p.status === 'Pending' &&
          localIds.includes(p.id) &&
          !authorizedFirestore.find(f => f.id === p.id)
        );

        return [...authorizedFirestore, ...pendingOptimistic].sort((a, b) => {
          const timeA = a.createdAt?.seconds || Date.now() / 1000;
          const timeB = b.createdAt?.seconds || Date.now() / 1000;
          return timeB - timeA;
        });
      });

      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  return (
    <div className="min-h-screen pb-20" style={{ background: C.bg, fontFamily: FONT.body }}>
      <PageBanner title="Digital Prescription Dispensing" subtitle="Upload doctor prescriptions for clinical verification and convenient in-store pickup." />

      <div className="max-w-[860px] mx-auto px-6 py-9 flex flex-col gap-10">
        <UploadForm
          onUploaded={(p) => setPrescriptions(prev => {
            if (prev.find(i => i.id === p.id)) return prev;
            return [p, ...prev];
          })}
          userId={currentUser?.uid}
        />

        <div>
          <SectionLabel icon={<FileText size={12} color={C.accent} />} label="My Orders" />
          <div className="flex flex-col gap-4 mt-4">
            {prescriptions.map(p => (<PrescriptionCard key={p.id} p={p} />))}
            {prescriptions.length === 0 && !loading && (
              <div className="p-10 text-center bg-white rounded-2xl border border-slate-100">
                <FileX className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-slate-500 font-bold">No history found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  );
}