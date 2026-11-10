import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Phone, Mail, Sun, Moon, Menu, X, FileText } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const FONT = { display: "'Playfair Display', serif", body: "'DM Sans', sans-serif" };

const WhatsAppIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function CustomerNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Home", href: "/customer" },
    ...(currentUser ? [
      { name: "My Prescriptions", href: "/customer/prescription" },
      { name: "My Orders", href: "/customer/orders" },
    ] : []),
    { name: "About", href: "/customer/about" },
    { name: "Contact", href: "/customer/contact" },
  ];

  const socialLinks = [
    { icon: <Phone size={13} strokeWidth={2} />, label: "+94 723 556 700", href: null },
    { icon: <FaFacebook size={13} />, label: "Facebook", href: "https://facebook.com", target: "_blank" },
    { icon: <WhatsAppIcon size={13} />, label: "WhatsApp", href: "https://wa.me/94723556700", target: "_blank" },
    { icon: <FaInstagram size={13} />, label: "Instagram", href: "https://instagram.com", target: "_blank" },
    { icon: <FaLinkedin size={13} />, label: "LinkedIn", href: "https://linkedin.com", target: "_blank" },
    { icon: <Mail size={13} strokeWidth={2} />, label: "info@happyhealth.lk", href: "mailto:info@happyhealth.lk", target: null },
  ];

  const isActive = (href) => {
    if (href === "/customer") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const topLinkStyle = {
    fontSize: 12.5,
    fontWeight: 500,
    color: "rgba(255,255,255,0.85)",
    textDecoration: "none",
    letterSpacing: "0.01em",
    transition: "color 0.15s",
    display: "flex",
    alignItems: "center",
    gap: 2,
  };

  const iconBtnBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", fontFamily: FONT.body }}>
      {/* Top Bar */}
      <div className="hidden sm:block" style={{ background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto", padding: "0 40px", height: 42, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 20 }}>
          {socialLinks.map(({ icon, label, href, target }) =>
            href ? (
              <a
                key={label}
                href={href}
                target={target || undefined}
                rel={target === "_blank" ? "noreferrer" : undefined}
                style={topLinkStyle}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.85)"}
              >
                {icon}{label}
              </a>
            ) : (
              <span key={label} style={{ ...topLinkStyle, cursor: "default" }}>{icon}{label}</span>
            )
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div style={{
        background: "var(--navbar-bg)",
        borderBottom: "1px solid var(--navbar-border)",
        boxShadow: "0 2px 16px rgba(22,115,75,0.08)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{ width: "100%", padding: "0 20px", boxSizing: "border-box" }} className="md:px-[40px]">
          <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

            {/* Logo */}
            <Link to="/customer" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundImage: "url('/logo.png')", backgroundSize: "cover", backgroundPosition: "center", border: "2.5px solid rgba(22,115,75,0.25)", flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 20, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  Happy Health
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.04em", marginTop: 1 }}>
                  Your Trusted Pharmacy
                </div>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex" style={{ alignItems: "center", justifyContent: "center", gap: 36, flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: FONT.body,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s, color 0.15s, box-shadow 0.15s",
                    ...(isActive(link.href)
                      ? {
                          background: "#16734B",
                          color: "#ffffff",
                          boxShadow: "0 4px 14px rgba(22,115,75,0.25)"
                        }
                      : {
                          color: "var(--text-primary)",
                          background: "transparent"
                        }
                    ),
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.background = "#EBF5EE";
                      e.currentTarget.style.color = "#16734B";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.href)) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Theme Toggle + Profile/Login */}
            <div className="hidden lg:flex" style={{ alignItems: "center", gap: 10, flexShrink: 0 }}>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#EBF5EE",
                  border: "1.5px solid var(--card-border)",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(22,115,75,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#EBF5EE"; }}
              >
                {isDarkMode ? <Sun size={20} color="#16734B" strokeWidth={1.8} /> : <Moon size={20} color="#16734B" strokeWidth={1.8} />}
              </button>

              {/* Profile & Auth */}
              {currentUser ? (
                <>
                  <button
                    onClick={() => navigate("/customer/profile")}
                    style={{ ...iconBtnBase, background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)", boxShadow: "0 4px 14px rgba(22,115,75,0.25)" }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                    title="Profile"
                  >
                    <User size={20} color="#ffffff" strokeWidth={1.8} />
                  </button>

                  <button
                    onClick={handleLogout}
                    style={{ ...iconBtnBase, background: "rgba(185,56,56,0.08)", border: "1.5px solid rgba(185,56,56,0.25)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(185,56,56,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(185,56,56,0.08)"; }}
                    title="Logout"
                  >
                    <LogOut size={20} color="#B93838" strokeWidth={1.8} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  style={{ 
                    padding: "0 22px", 
                    height: 44,
                    borderRadius: 12, 
                    background: "linear-gradient(135deg, #10573A 0%, #16734B 100%)", 
                    color: "#ffffff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(22,115,75,0.25)",
                    fontFamily: FONT.body,
                    display: "flex",
                    alignItems: "center"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  Login / Register
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#EBF5EE",
                  border: "1.5px solid var(--card-border)",
                  cursor: "pointer",
                }}
              >
                {isDarkMode ? <Sun size={18} color="#16734B" /> : <Moon size={18} color="#16734B" />}
              </button>
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#EBF5EE",
                  border: "1.5px solid var(--card-border)",
                  cursor: "pointer",
                }}
              >
                {isMobileMenuOpen ? <X size={20} color="#16734B" /> : <Menu size={20} color="#16734B" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden flex flex-col border-t" style={{ background: "var(--navbar-bg)", borderColor: "var(--navbar-border)" }}>
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: "none",
                    ...(isActive(link.href)
                      ? { background: "#16734B", color: "#ffffff" }
                      : { color: "var(--text-primary)" }
                    ),
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <hr style={{ borderColor: "var(--navbar-border)", margin: "8px 0", borderWidth: "1px 0 0 0" }} />
              {currentUser ? (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); navigate("/customer/profile"); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-none"
                    style={{ background: "#16734B", color: "#fff", fontWeight: "bold" }}
                  >
                    <User size={18} /> Profile
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-none"
                    style={{ background: "rgba(185,56,56,0.1)", color: "#B93838", fontWeight: "bold" }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg mt-2 border-none"
                  style={{ background: "#16734B", color: "#fff", fontWeight: "bold" }}
                >
                  Login / Register
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
