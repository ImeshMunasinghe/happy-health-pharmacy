import React from "react";
import { FileText, Upload, Sparkles } from "lucide-react";

const C = {
  accent: "#16734B",
  accentDark: "#10573A",
  accentSoft: "#EBF5EE",
};

const FONT = { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif" };

export default function UploadPrescriptionSection({ onOpen }) {
  return (
    <section style={{
      padding: "64px 24px",
      background: "linear-gradient(135deg, #10573A 0%, #16734B 60%, #238C5D 100%)",
      textAlign: "center",
      fontFamily: FONT.body,
      borderRadius: "24px",
      boxShadow: "0 12px 36px rgba(22, 115, 75, 0.18)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative radial highlight */}
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.08)",
        pointerEvents: "none",
      }} />

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: "rgba(255,255,255,0.18)",
        border: "1.5px solid rgba(255,255,255,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        backdropFilter: "blur(6px)",
      }}>
        <FileText size={28} color="#ffffff" />
      </div>

      {/* Label */}
      <p style={{
        fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.85)",
        textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 10,
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        <Sparkles size={14} /> Happy Health Self-Service
      </p>

      {/* Heading */}
      <h2 style={{
        fontSize: 32, fontWeight: 800,
        color: "#ffffff", margin: "0 0 14px",
        letterSpacing: "-0.01em",
      }}>
        Upload Prescription
      </h2>

      {/* Underline accent */}
      <div style={{
        width: 48, height: 3, borderRadius: 4,
        background: "rgba(255,255,255,0.5)",
        margin: "0 auto 20px",
      }} />

      {/* Subtitle */}
      <p style={{
        fontSize: 15, color: "rgba(255,255,255,0.85)",
        marginBottom: 32, lineHeight: 1.6, maxWidth: 520,
        marginLeft: "auto", marginRight: "auto",
        fontWeight: 500,
      }}>
        Upload your doctor's prescription for rapid pharmacist review, clinical cross-checking, and counter pickup preparation.
      </p>

      {/* Button */}
      <button
        onClick={onOpen}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 40px",
          borderRadius: 14,
          fontSize: 15, fontWeight: 800,
          fontFamily: FONT.body,
          background: "#ffffff",
          color: C.accentDark,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          transition: "transform 0.15s, box-shadow 0.15s, background-color 0.15s",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.22)";
          e.currentTarget.style.backgroundColor = "#F7FAF8";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
          e.currentTarget.style.backgroundColor = "#ffffff";
        }}
      >
        <Upload size={18} color={C.accentDark} />
        Upload Now
      </button>

    </section>
  );
}
