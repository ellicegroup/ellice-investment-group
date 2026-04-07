"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/market", label: "Market" },
  { href: "/calculator", label: "Calculator" },
  { href: "/learn", label: "Learn" },
];

function LogoFull() {
  return (
    <svg viewBox="0 0 320 52" width="320" height="52" xmlns="http://www.w3.org/2000/svg" aria-label="Ellice Capital">
      <g transform="translate(26,26)">
        <polygon points="0,-23 20,-11.5 20,11.5 0,23 -20,11.5 -20,-11.5" fill="#534AB7" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <text x="0" y="6" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill="#EF9F27" letterSpacing="1">EC</text>
      </g>
      <text x="60" y="23" fontFamily="Georgia, serif" fontSize="22" fontWeight="700" letterSpacing="7" fill="white">ELLICE</text>
      <text x="61" y="38" fontFamily="-apple-system, Arial, sans-serif" fontSize="9" letterSpacing="2.5" fill="rgba(255,255,255,0.65)">CAPITAL · INVESTMENT GROUP</text>
      <line x1="204" y1="8" x2="204" y2="44" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="214" y="20" fontFamily="Georgia, serif" fontSize="9.5" letterSpacing="0.5" fill="rgba(255,255,255,0.65)">Pacific</text>
      <text x="214" y="32" fontFamily="Georgia, serif" fontSize="9.5" letterSpacing="0.5" fill="rgba(255,255,255,0.65)">Sovereign</text>
      <text x="214" y="44" fontFamily="Georgia, serif" fontSize="9.5" letterSpacing="0.5" fill="rgba(255,255,255,0.65)">Capital</text>
    </svg>
  );
}

export default function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: "#0d0b1a", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

        <Link href="/" style={{ textDecoration: "none", flexShrink: 0, lineHeight: 0 }}>
          <LogoFull />
        </Link>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: active ? "19px 12px 17px" : "18px 12px",
                  fontSize: 11,
                  fontFamily: "-apple-system, Arial, sans-serif",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: active ? "white" : "rgba(255,255,255,0.5)",
                  borderBottom: active ? "1px solid #534AB7" : "1px solid transparent",
                  transition: "color 0.15s",
                  letterSpacing: 0.3,
                }}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/login"
            style={{
              marginLeft: 14,
              padding: "8px 16px",
              borderRadius: 4,
              fontSize: 11,
              fontFamily: "-apple-system, Arial, sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              background: "#534AB7",
              color: "white",
              letterSpacing: 0.3,
            }}
          >
            Investor Portal →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{ display: "none", background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", padding: 4 }}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: "#0d0b1a", borderTop: "0.5px solid rgba(255,255,255,0.08)", padding: "8px 24px 20px" }}>
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block", padding: "13px 0", fontSize: 13,
                fontFamily: "-apple-system, Arial, sans-serif",
                color: pathname === href ? "white" : "rgba(255,255,255,0.5)",
                textDecoration: "none",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            style={{
              display: "block", marginTop: 14, padding: "11px 16px",
              fontSize: 13, fontWeight: 600, fontFamily: "-apple-system, Arial, sans-serif",
              color: "white", textDecoration: "none",
              background: "#534AB7", borderRadius: 4, textAlign: "center",
            }}
          >
            Investor Portal →
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
