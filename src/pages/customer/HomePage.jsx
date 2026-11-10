import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Package, RotateCcw, User, Pill, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import UploadPrescriptionSection from '../../components/UploadPrescriptionSection';

export default function HomePage() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Prescriptions",
      desc: "Upload and manage prescription orders",
      icon: FileText,
      path: "/customer/prescription",
      badge: "Fast Track",
    },
    {
      title: "Dispensing Status",
      desc: "Track prescription review & preparation",
      icon: Package,
      path: "/customer/orders",
      badge: "Real-time",
    },
    {
      title: "Returns & Exchanges",
      desc: "Submit medicine return requests",
      icon: RotateCcw,
      path: "/customer/returns",
      badge: "Support",
    },
    {
      title: "Patient Profile",
      desc: "Update contact details and history",
      icon: User,
      path: "/customer/profile",
      badge: "Account",
    },
  ];

  const highlights = [
    { icon: ShieldCheck, title: "Licensed Pharmacists", text: "Every prescription verified by registered healthcare professionals." },
    { icon: Clock, title: "Prompt Dispensing", text: "Fast in-store turnaround with live SMS and portal status updates." },
    { icon: Pill, title: "Genuine Medication", text: "100% verified pharmaceuticals sourced directly from authorized suppliers." },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F7FAF8] text-[#142D23]">

      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-white border-b border-[#DAE5DE] py-14 sm:py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#142D23] leading-tight">
                Your Health, <br />
                <span className="text-[#16734B]">Made Simpler.</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[#52665D] leading-relaxed">
                Welcome to Happy Health's patient self-service portal. Upload doctor prescriptions,
                track preparation progress in real-time, and view verified dispensing records.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/customer/prescription")}
                  className="px-6 py-3.5 rounded-xl font-bold text-white bg-[#16734B] hover:bg-[#10573A] shadow-md shadow-[#16734B]/20 flex items-center gap-2 transition cursor-pointer border-none"
                >
                  <FileText size={18} />
                  Upload Prescription
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate("/customer/orders")}
                  className="px-6 py-3.5 rounded-xl font-bold text-[#16734B] bg-[#EBF5EE] hover:bg-[#16734B]/10 border border-[#16734B]/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <Package size={18} />
                  Track Dispensing Status
                </button>
              </div>
            </div>

            {/* Hero Quick Info Card */}
            <div className="w-full lg:w-96 bg-[#F7FAF8] rounded-2xl p-6 border border-[#DAE5DE] shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#52665D] mb-4">
                Pharmacy Operating Hours
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#DAE5DE]">
                  <span className="text-[#52665D]">Mon – Sat:</span>
                  <span className="font-semibold text-[#142D23]">8:00 AM – 10:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DAE5DE]">
                  <span className="text-[#52665D]">Sunday & Poya:</span>
                  <span className="font-semibold text-[#142D23]">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#DAE5DE]">
                  <span className="text-[#52665D]">Emergency Hotline:</span>
                  <span className="font-semibold text-[#16734B]">+94 723 556 700</span>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#EBF5EE] border border-[#16734B]/20">
                <p className="text-xs font-semibold text-[#16734B] flex items-center gap-1.5">
                  <ShieldCheck size={16} /> Safe Clinical Standard
                </p>
                <p className="text-xs text-[#52665D] mt-1">
                  All digital prescriptions are cross-checked for contraindications prior to dispensing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Patient Quick Services ─── */}
      <section className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#142D23]">Patient Services</h2>
          <p className="text-sm text-[#52665D] mt-1">Fast access to your personal pharmacy records and requests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickLinks.map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="group p-6 rounded-2xl bg-white border border-[#DAE5DE] hover:border-[#16734B] shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF5EE] text-[#16734B] flex items-center justify-center group-hover:bg-[#16734B] group-hover:text-white transition">
                    <item.icon size={22} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#16734B] bg-[#EBF5EE] px-2 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#142D23] group-hover:text-[#16734B] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-[#52665D] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#16734B]">
                Access service <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Prescription Upload Component ─── */}
      <section className="max-w-6xl mx-auto pb-12 px-4 sm:px-8">
        <UploadPrescriptionSection onOpen={() => navigate("/customer/prescription")} />
      </section>

      {/* ─── Highlights / Assurance ─── */}
      <section className="bg-white border-t border-[#DAE5DE] py-14 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h) => (
              <div key={h.title} className="flex items-start gap-4 p-4 rounded-xl bg-[#F7FAF8] border border-[#DAE5DE]">
                <div className="p-3 rounded-xl bg-[#EBF5EE] text-[#16734B] shrink-0">
                  <h.icon size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-[#142D23] text-sm">{h.title}</h4>
                  <p className="text-xs text-[#52665D] mt-1 leading-relaxed">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
