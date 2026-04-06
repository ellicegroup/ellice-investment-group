import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const STATS = [
  { label: "Total AUM",        value: "$108M+",   note: "Assets under management" },
  { label: "Fund Investors",   value: "15",        note: "Active investor accounts" },
  { label: "2025 Return",      value: "+20.4%",    note: "Full year 2025 fund return" },
  { label: "Years Operating",  value: "3+",        note: "Since fund inception" },
];

const VALUES = [
  {
    icon: "◈",
    title: "Disciplined Investing",
    body: "We follow a rigorous, research-driven investment process focused on long-term value creation across Pacific markets and global equities.",
  },
  {
    icon: "◻",
    title: "Transparency",
    body: "Every investor has real-time access to their account, portfolio performance, and quarterly statements through our secure investor portal.",
  },
  {
    icon: "≡",
    title: "Pacific Focus",
    body: "Rooted in the Pacific, our fund brings institutional-grade investment management to investors across New Zealand, Australia, and the wider region.",
  },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* ── Hero ── */}
      <section style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 60%, #0d2a1a 100%)", color: "white", padding: "100px 32px 120px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", padding: "6px 16px", borderRadius: 100, marginBottom: 28 }}>
            Ellice Growth Fund I
          </span>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: -1 }}>
            Pacific-Focused Investment<br />
            <span style={{ color: "#D4AF37" }}>Built for the Long Term</span>
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 44, maxWidth: 580, margin: "0 auto 44px" }}>
            Ellice Investment Group manages a diversified private fund delivering institutional-grade returns for our investors across the Pacific and beyond.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{ padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0d1b2a", textDecoration: "none" }}>
              Investor Portal →
            </Link>
            <Link href="/about" style={{ padding: "14px 32px", borderRadius: 10, fontWeight: 600, fontSize: 15, background: "rgba(255,255,255,0.08)", color: "white", textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)" }}>
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: "#f8f7f4", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {STATS.map(({ label, value, note }) => (
            <div key={label} style={{ background: "white", borderRadius: 16, padding: "32px 28px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #eee", textAlign: "center" }}>
              <p style={{ fontSize: 40, fontWeight: 700, color: "#2D5A43", margin: "0 0 6px" }}>{value}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>{label}</p>
              <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── About the Fund ── */}
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 16 }}>About the Fund</p>
            <h2 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.25, margin: "0 0 20px", color: "#0d1b2a" }}>
              Disciplined Capital for<br />Pacific Investors
            </h2>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.8, marginBottom: 20 }}>
              Founded to serve Pacific Island investors, Ellice Growth Fund I invests in a diversified portfolio of global equities, fixed income, and opportunistic positions — managed with the rigour of institutional investment practice.
            </p>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.8, marginBottom: 32 }}>
              Our investors receive quarterly statements, real-time portfolio visibility, and direct access to fund documents through their personal investor portal — all secured with bank-level authentication.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <Link href="/about" style={{ padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, background: "#2D5A43", color: "white", textDecoration: "none" }}>
                Meet the Team
              </Link>
              <Link href="/market" style={{ padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "1px solid #ddd", color: "#555", textDecoration: "none" }}>
                Market Updates
              </Link>
            </div>
          </div>
          {/* Visual panel */}
          <div style={{ background: "linear-gradient(135deg, #0d1b2a, #1b3a5c)", borderRadius: 20, padding: 40, color: "white" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#D4AF37", marginBottom: 24 }}>Portfolio Snapshot</p>
            {[
              { label: "Financials",   pct: 53.2, color: "#D4AF37" },
              { label: "Technology",   pct: 30.5, color: "#2D5A43" },
              { label: "Energy",       pct: 5.3,  color: "#4a8a6a" },
              { label: "Fixed Income", pct: 2.5,  color: "#888" },
            ].map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ color: "rgba(255,255,255,0.8)" }}>{label}</span>
                  <span style={{ color, fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3 }}>
                  <div style={{ height: 6, width: `${pct}%`, background: color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 24 }}>Allocation as of latest portfolio update</p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ background: "#f8f7f4", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 12 }}>Why Ellice</p>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: "#0d1b2a", margin: 0 }}>What Sets Us Apart</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #eee" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0d1b2a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 20, color: "#D4AF37" }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0d1b2a", margin: "0 0 12px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investor CTA ── */}
      <section style={{ background: "linear-gradient(135deg, #2D5A43, #1a3828)", padding: "80px 32px", textAlign: "center", color: "white" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: 34, fontWeight: 700, margin: "0 0 16px" }}>Already an Investor?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: 36 }}>
            Access your account, view your latest statement, and download fund documents through the secure investor portal.
          </p>
          <Link href="/login" style={{ display: "inline-block", padding: "14px 36px", borderRadius: 10, fontWeight: 700, fontSize: 15, background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#0d1b2a", textDecoration: "none" }}>
            Sign In to Investor Portal →
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
