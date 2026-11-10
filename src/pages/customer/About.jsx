import React from "react";
import { ShieldCheck, Truck, HeartPulse, Users, Target, Eye, Pill, FileText, CheckCircle } from "lucide-react";
import { C } from "../../components/profile/profileTheme";

const FONT = { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif" };

export default function About() {
  return (
    <div style={{ fontFamily: FONT.body, background: C.bg }}>

      {/* 🔷 HERO */}
      <section style={{
        background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)",
        padding: "60px 20px",
        textAlign: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 250, height: 250, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontFamily: FONT.body,
            fontSize: 40,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: "-1px"
          }}>
            About Happy Health Pharmacy
          </h1>

          <p style={{ opacity: 0.95, fontSize: 18, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            Your neighborhood pharmacy management information system delivering safe clinical dispensing, prescription tracking, and dependable patient care.
          </p>
        </div>
      </section>

      {/* 🔷 ABOUT */}
      <section style={{ padding: "80px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 16, letterSpacing: "-0.5px" }}>Who We Are</h2>
          <div style={{ width: 80, height: 4, background: "linear-gradient(90deg, #16734B, #34d399)", margin: "0 auto", borderRadius: 2 }} />
        </div>

        <p style={{ color: C.textSoft, lineHeight: 1.85, fontSize: 16, marginBottom: 20 }}>
          <strong style={{ color: "#16734B", fontSize: 17 }}>Happy Health</strong> is a licensed community pharmacy operating with an advanced computer-based Management Information System (MIS). We provide patient-focused pharmaceutical services, digital prescription validation, and verified medical essentials.
        </p>

        <p style={{ marginTop: 18, color: C.textSoft, lineHeight: 1.85, fontSize: 16 }}>
          Our objective is to combine clinical expertise with modern health informatics — eliminating dispensing errors, reducing customer wait times, and making prescription management simple and transparent for every patient.
        </p>
      </section>

      {/* 🔷 MISSION + VISION */}
      <section style={{
        background: "var(--card-bg, #ffffff)",
        borderTop: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        padding: "70px 20px"
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 25
        }}>
          <MissionCard
            icon={<Target size={28} />}
            title="Our Mission"
            desc="To provide safe, verified, and prompt dispensing of doctor prescriptions while maintaining the highest clinical standards of drug safety and patient confidentiality."
          />

          <MissionCard
            icon={<Eye size={28} />}
            title="Our Vision"
            desc="To be the local benchmark for community healthcare by integrating intelligent pharmacy information systems with accessible, compassionate patient care."
          />
        </div>
      </section>

      {/* 🔷 WHY US */}
      <section style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 16, letterSpacing: "-0.5px" }}>
            Why Choose Happy Health?
          </h2>
          <div style={{ width: 80, height: 4, background: "linear-gradient(90deg, #16734B, #34d399)", margin: "0 auto", borderRadius: 2 }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24
        }}>
          <Feature icon={<ShieldCheck size={28} />} text="Licensed Verification" desc="Every digital Rx is inspected by qualified pharmacists." />
          <Feature icon={<Pill size={28} />} text="100% Genuine Medicine" desc="Authorized stock from certified medical distributors." />
          <Feature icon={<HeartPulse size={28} />} text="Safety Interaction Checks" desc="AI-enabled contraindication and dosage screening." />
          <Feature icon={<Users size={28} />} text="Patient First Care" desc="Transparent quotes and convenient in-store collection." />
        </div>
      </section>

      {/* 🔷 SERVICES */}
      <section style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        padding: "80px 20px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: C.textPrimary, marginBottom: 16, letterSpacing: "-0.5px" }}>
              Pharmacy Services
            </h2>
            <div style={{ width: 80, height: 4, background: "linear-gradient(90deg, #16734B, #34d399)", margin: "0 auto", borderRadius: 2 }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20
          }}>
            <ServiceCard icon={<FileText size={24} />} text="Prescription Upload & Review" />
            <ServiceCard icon={<CheckCircle size={24} />} text="Live Dispensing Tracking" />
            <ServiceCard icon={<ShieldCheck size={24} />} text="Clinical Drug Screening" />
            <ServiceCard icon={<Pill size={24} />} text="Essential Medicines Catalog" />
          </div>
        </div>
      </section>

      {/* 🔷 CTA */}
      <section style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 14, letterSpacing: "-0.5px" }}>Your Health, Our Priority</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 17, maxWidth: 580, margin: "10px auto 0" }}>
            Upload your prescription now to receive a verified price quote and rapid preparation update.
          </p>

          <a href="/customer/prescription" style={{
            marginTop: 28,
            display: "inline-block",
            background: "#fff",
            color: "#16734B",
            padding: "14px 32px",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
            transition: "all 0.25s ease",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            cursor: "pointer"
          }}>
            Upload Prescription
          </a>
        </div>
      </section>

    </div>
  );
}

function MissionCard({ icon, title, desc }) {
  return (
    <div style={{
      background: C.surface,
      padding: 30,
      borderRadius: 16,
      border: `1.5px solid ${C.border}`,
      transition: "all 0.3s ease",
    }}>
      <div style={{ marginBottom: 16, color: "#16734B" }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, marginBottom: 10 }}>{title}</h3>
      <p style={{ color: C.textSoft, lineHeight: 1.8, fontSize: 14 }}>
        {desc}
      </p>
    </div>
  );
}

function Feature({ icon, text, desc }) {
  return (
    <div style={{
      background: C.surface,
      padding: 26,
      borderRadius: 16,
      textAlign: "center",
      boxShadow: "0 2px 12px rgba(22,115,75,0.06)",
      border: `1px solid ${C.border}`,
      transition: "all 0.3s ease",
    }}>
      <div style={{ marginBottom: 14, color: "#16734B" }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{text}</div>
      <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}

function ServiceCard({ icon, text }) {
  return (
    <div style={{
      background: C.surface,
      padding: 24,
      borderRadius: 16,
      textAlign: "center",
      fontSize: 15,
      fontWeight: 600,
      color: C.textPrimary,
      border: `1px solid ${C.border}`,
      transition: "all 0.3s ease",
    }}>
      <div style={{ marginBottom: 10, color: "#16734B" }}>{icon}</div>
      {text}
    </div>
  );
}
