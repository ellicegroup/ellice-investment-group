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

export default function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ background: "#0d1b2a", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Ellice Investment Group" style={{ height: 40, width: "auto", filter: "brightness(0) invert(1)" }} />
        </Link>

        {/* Desktop links */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                color: pathname === href ? "#D4AF37" : "rgba(255,255,255,0.65)",
                borderBottom: pathname === href ? "2px solid #D4AF37" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            style={{
              marginLeft: 16,
              padding: "9px 22px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              background: "linear-gradient(135deg, #c9a84c, #f0d080)",
              color: "#0d1b2a",
              transition: "opacity 0.15s",
            }}
          >
            Investor Portal →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-menu-btn"
          style={{ display: "none", background: "none", border: "none", color: "white", fontSize: 22, cursor: "pointer", padding: 4 }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#0d1b2a", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 24px 20px" }}>
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ display: "block", padding: "12px 0", fontSize: 15, color: pathname === href ? "#D4AF37" : "rgba(255,255,255,0.7)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            style={{ display: "block", marginTop: 16, padding: "12px 0", fontSize: 15, fontWeight: 600, color: "#D4AF37", textDecoration: "none" }}
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
