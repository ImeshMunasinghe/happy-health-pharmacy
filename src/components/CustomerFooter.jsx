import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const C = {
  bg:          "#10573A",
  surface:     "rgba(255,255,255,0.06)",
  border:      "rgba(235,245,238,0.2)",
  accent:      "#EBF5EE",
  textPrimary: "#ffffff",
  textMuted:   "rgba(255,255,255,0.75)",
  textSoft:    "rgba(255,255,255,0.45)",
};

const FONT = { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif" };

const linkStyle = {
  fontSize: 13,
  color: C.textMuted,
  textDecoration: "none",
  fontFamily: FONT.body,
  transition: "color 0.15s",
};

function FooterLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        style={linkStyle}
        onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
        onMouseLeave={e => e.currentTarget.style.color = C.textMuted}
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  const contactItems = [
    { icon: <Phone size={14} strokeWidth={1.8} />,  text: "+94 723 556 700"     },
    { icon: <Mail size={14} strokeWidth={1.8} />,   text: "info@happyhealth.lk" },
    { icon: <MapPin size={14} strokeWidth={1.8} />, text: "Colombo, Sri Lanka"  },
  ];

  const socialLinks = [
    { href: "https://facebook.com",      icon: <FaFacebook size={15} />,  label: "Facebook"  },
    { href: "https://twitter.com",       icon: <FaTwitter size={15} />,   label: "Twitter"   },
    { href: "https://instagram.com",     icon: <FaInstagram size={15} />, label: "Instagram" },
    { href: "https://linkedin.com",      icon: <FaLinkedin size={15} />,  label: "LinkedIn"  },
    { href: "https://wa.me/94723556700", icon: <FaWhatsapp size={15} />,  label: "WhatsApp"  },
  ];

  return (
    <footer style={{ background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)", fontFamily: FONT.body }}>

      {/* Top accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, rgba(235,245,238,0.2), rgba(235,245,238,0.7), rgba(235,245,238,0.2))" }} />

      <div style={{ width: "100%", padding: "36px 40px", boxSizing: "border-box" }}>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 32,
        }}>

          {/* COMPANY */}
          <div>
            <h2 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: C.textPrimary, marginBottom: 4, marginTop: 0 }}>
              Happy Health
            </h2>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, marginTop: 0 }}>
              Your Trusted Pharmacy MIS
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
              Dedicated to clinical safety, verified prescription dispensing, and patient health support.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, marginTop: 0 }}>
              Quick Services
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              <FooterLink to="/customer/products">Medicines Catalog</FooterLink>
              <FooterLink to="/customer/prescription">Upload Prescription</FooterLink>
              <FooterLink to="/customer/orders">Dispensing Status</FooterLink>
              <FooterLink to="/customer/returns">Returns & Inquiries</FooterLink>
            </ul>
          </div>

          {/* INFORMATION */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, marginTop: 0 }}>
              Information
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
              <FooterLink to="/customer/about">About Happy Health</FooterLink>
              <FooterLink to="/customer/contact">Contact & Hours</FooterLink>
              <FooterLink to="/customer/profile">Patient Account</FooterLink>
              <FooterLink to="/customer/settings">Account Settings</FooterLink>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, marginTop: 0 }}>
              Contact
            </h3>

            {/* Contact Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {contactItems.map(({ icon, text }) => (
                <p key={text} style={{
                  fontSize: 13, color: C.textMuted,
                  display: "flex", alignItems: "center", gap: 8,
                  margin: 0,
                }}>
                  <span style={{ color: "rgba(255,255,255,0.85)", flexShrink: 0 }}>{icon}</span>
                  {text}
                </p>
              ))}
            </div>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {socialLinks.map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "none",
                    transition: "background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          marginTop: 32, paddingTop: 20,
          textAlign: "center",
          fontSize: 12, color: "rgba(255,255,255,0.6)",
          fontFamily: FONT.body,
        }}>
          © 2026 Happy Health Pharmacy MIS — All Rights Reserved
        </div>

      </div>
    </footer>
  );
}
