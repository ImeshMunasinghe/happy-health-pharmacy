import { useState } from 'react';
import {
  Phone, MapPin, Package, CreditCard,
  CheckCircle, ChevronRight,
  Truck, Receipt, Clock, FileText, Check
} from 'lucide-react';
import { C, FONT } from '../profile/profileTheme';
import { StatusBadge } from './Orderstatusutils';
import Card from '../Card';

export default function OrderCard({ order }) {
  const [showBill, setShowBill] = useState(false);

  // Convert Firestore Timestamp to a readable date string
  const createdAt = order.createdAt?.toDate
    ? order.createdAt.toDate().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
    : (order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) : '—');

  return (
    <Card
      header={
        <div
          className="flex justify-between items-center flex-wrap gap-2 px-6 py-4 -mx-6 -mt-5 mb-3"
          style={{ background: '#EBF5EE', borderBottom: `1px solid ${C.border}` }}
        >
          <div>
            <p className="text-[13px] mb-[2px]" style={{ color: C.textMuted }}>
              {order.type === 'prescription' ? 'Prescription' : 'Order'}{' '}
              <span className="font-bold" style={{ color: C.textPrimary }}>
                #{order.id?.slice(-8) || 'N/A'}
              </span>
            </p>
            <p className="text-[11px] flex items-center gap-1.5" style={{ color: C.textSoft }}>
              <Clock size={11} /> {createdAt}
            </p>
          </div>
          <StatusBadge status={order.orderStatus} />
        </div>
      }
    >
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2 text-xs" style={{ color: C.textMuted }}>
          <Phone size={14} color="#16734B" />
          <span>{order.phone || 'No phone provided'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: C.textMuted }}>
          <MapPin size={14} color="#16734B" />
          <span className="truncate">{order.address || 'In-Store Pickup'}</span>
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-2 mb-4">
        {(order.types || []).map((m, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs py-1">
            <span className="font-semibold text-[#142D23]">
              {m.name} {m.quantity ? <span className="text-[#52665D]">× {m.quantity}</span> : ''}
            </span>
            {m.price ? (
              <span className="font-bold text-[#16734B]">Rs. {(m.quantity * m.price).toFixed(2)}</span>
            ) : (
              <span className="text-[11px] text-[#52665D] italic">To be dispensed</span>
            )}
          </div>
        ))}
      </div>

      {/* Status Highlights */}
      {order.orderStatus === 'Approved' && (
        <div className="p-4 rounded-xl bg-[#EBF5EE] border border-[#16734B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs font-bold text-[#16734B] flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle size={15} /> Approved by Pharmacist
            </p>
            <p className="text-xs text-[#52665D] mt-0.5">
              Total Quote: <strong className="text-[#142D23]">Rs. {(order.total || order.totalAmount || 0).toFixed(2)}</strong>. Pay at counter upon collection.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-[#16734B] text-white text-xs font-bold shrink-0 self-start sm:self-auto">
            Ready for Pickup
          </span>
        </div>
      )}

      {order.orderStatus === 'Dispensed' && (
        <div className="p-3.5 rounded-xl bg-[#EBF5EE] border border-[#16734B]/20 flex items-center gap-3 mb-4">
          <CheckCircle size={18} color="#16734B" />
          <div>
            <p className="text-xs font-bold text-[#16734B] uppercase tracking-wider">Medications Dispensed</p>
            <p className="text-xs text-[#52665D]">Dispensing completed by Happy Health Pharmacist.</p>
          </div>
        </div>
      )}

      {/* Card footer: payment info */}
      <div className="flex justify-between items-center flex-wrap gap-2 pt-3 border-t border-[#DAE5DE]/60">
        <div className="flex gap-2.5 items-center">
          <CreditCard size={15} color="#52665D" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#52665D]">
            {order.paymentMethod || 'In-Store Payment'}
          </span>
        </div>
        {(order.total || order.totalAmount) ? (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#52665D]">Total</span>
            <p className="text-base font-black text-[#16734B]">Rs. {(order.total || order.totalAmount).toFixed(2)}</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
