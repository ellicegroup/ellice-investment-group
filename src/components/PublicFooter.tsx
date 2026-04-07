import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer style={{ background: "#0d1b2a", borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 32px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
        {/* Brand */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="Ellice Investment Group" style={{ height: 44, width: "auto", marginBottom: 16 }} />
          <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
            A Pacific-focused private investment fund committed to disciplined, long-term wealth creation for our investors.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#D4AF37", marginBottom: 16 }}>Navigate</p>
          {[["Home", "/"], ["About", "/about"], ["Market", "/market"], ["Calculator", "/calculator"], ["Learn", "/learn"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 10, transition: "color 0.15s" }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Investors */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#D4AF37", marginBottom: 16 }}>Investors</p>
          {[["Investor Portal", "/login"], ["Account Statements", "/login"], ["Documents", "/login"]].map(([label, href]) => (
            <Link key={label} href={href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 10 }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#D4AF37", marginBottom: 16 }}>Contact</p>
          <p style={{ fontSize: 13, marginBottom: 8 }}>etekafa@elliceinvestmentgroup.com</p>
          <p style={{ fontSize: 13 }}>support@elliceinvestmentgroup.com</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} Ellice Investment Group. All rights reserved.</p>
        <p style={{ fontSize: 12 }}>This website is for informational purposes only and does not constitute investment advice.</p>
      </div>
    </footer>
  );
}
