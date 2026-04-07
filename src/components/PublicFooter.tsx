import Link from "next/link";

function LogoSimple() {
  return (
    <svg viewBox="0 0 168 34" width="168" height="34" xmlns="http://www.w3.org/2000/svg" aria-label="Ellice Capital">
      <g transform="translate(17,17)">
        <polygon points="0,-14.7 12.7,-7.35 12.7,7.35 0,14.7 -12.7,7.35 -12.7,-7.35" fill="#534AB7" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <polygon points="0,-10.5 9,-5.25 9,5.25 0,10.5 -9,5.25 -9,-5.25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
        <text x="0" y="4.5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fontWeight="700" fill="#EF9F27" letterSpacing="1">EC</text>
      </g>
      <text x="39" y="22" fontFamily="Georgia, serif" fontSize="15" fontWeight="700" letterSpacing="5" fill="white">ELLICE</text>
    </svg>
  );
}

const colHead: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: 2,
  color: "rgba(255,255,255,0.5)",
  marginBottom: 14,
  fontFamily: "-apple-system, Arial, sans-serif",
  margin: "0 0 14px",
};

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  color: "rgba(255,255,255,0.35)",
  textDecoration: "none",
  marginBottom: 10,
  fontFamily: "-apple-system, Arial, sans-serif",
};

export default function PublicFooter() {
  return (
    <footer style={{ background: "#0d0b1a", fontFamily: "-apple-system, Arial, sans-serif" }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "32px 48px",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32,
      }}>
        {/* Col 1: Logo + tagline */}
        <div>
          <LogoSimple />
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "10px 0 10px", letterSpacing: 0.5 }}>
            Capital · Investment Group
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.65, margin: 0, maxWidth: 220 }}>
            A Pacific-focused private investment fund committed to disciplined, long-term wealth creation for our investors.
          </p>
        </div>

        {/* Col 2: Navigate */}
        <div>
          <p style={colHead}>Navigate</p>
          {([["Home", "/"], ["About", "/about"], ["Market", "/market"], ["Calculator", "/calculator"], ["Learn", "/learn"]] as [string, string][]).map(([label, href]) => (
            <Link key={href} href={href} style={linkStyle}>{label}</Link>
          ))}
        </div>

        {/* Col 3: Investors */}
        <div>
          <p style={colHead}>Investors</p>
          {([["Investor Portal", "/login"], ["Statements", "/login"], ["Documents", "/login"]] as [string, string][]).map(([label, href]) => (
            <Link key={label} href={href} style={linkStyle}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "12px 48px",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8,
      }}>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          © {new Date().getFullYear()} Ellice Capital. All rights reserved.
        </p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          etekafa@elliceinvestmentgroup.com
        </p>
      </div>
    </footer>
  );
}
