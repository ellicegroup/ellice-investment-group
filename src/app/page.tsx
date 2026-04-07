import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getFundMetrics } from "@/lib/metricsSheets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ellice Investment Group — Pacific-Focused Investment Management",
  description:
    "Ellice Capital manages two private funds delivering institutional-grade returns for investors across the Pacific and beyond.",
};

export const revalidate = 300;

export default async function HomePage() {
  const metrics = await getFundMetrics();

  const STATS = [
    { label: "FUND I IRR",         value: metrics.fund1Irr,                    teal: false },
    { label: "FUND I 2025",        value: metrics.fund1ReturnYtd,              teal: true  },
    { label: "S&P 500 2025",       value: metrics.sp500ReturnYtd,              teal: false },
    { label: "ACTIVE INVESTORS",   value: String(metrics.activeInvestors),     teal: true  },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, Arial, sans-serif", color: "#1a1a1a" }}>
      <PublicNav />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ background: "#0d0b1a", padding: "64px 48px 56px", color: "white" }}>
        <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }}>

          {/* LEFT: text content */}
          <div>
            {/* Eyebrow pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(83,74,183,0.2)", border: "0.5px solid rgba(83,74,183,0.4)",
              borderRadius: 2, padding: "5px 12px", marginBottom: 24,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D9E75", flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2, color: "#AFA9EC", textTransform: "uppercase", fontFamily: "-apple-system, Arial, sans-serif" }}>
                Two Funds Under Management
              </span>
            </div>

            {/* H1 */}
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 18px", color: "white" }}>
              Where Pacific Roots Meet{" "}
              <span style={{ color: "#AFA9EC" }}>Institutional</span> Returns.
            </h1>

            {/* Subtext */}
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 420, margin: "0 0 32px" }}>
              Ellice Capital manages two closed-end funds delivering disciplined, long-term growth
              for Pacific investors — with the rigour of institutional asset management.
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/login" style={{
                padding: "10px 20px", borderRadius: 4, fontWeight: 600, fontSize: 11,
                background: "#534AB7", color: "white", textDecoration: "none",
                fontFamily: "-apple-system, Arial, sans-serif", letterSpacing: 0.3,
              }}>
                Investor Portal →
              </Link>
              <Link href="/about" style={{
                padding: "10px 20px", borderRadius: 4, fontWeight: 600, fontSize: 11,
                border: "0.5px solid rgba(255,255,255,0.25)", color: "white", textDecoration: "none",
                fontFamily: "-apple-system, Arial, sans-serif", letterSpacing: 0.3,
              }}>
                Our Approach
              </Link>
            </div>
          </div>

          {/* RIGHT: live stats panel */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: 24,
          }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
              <span style={{ fontSize: 9, letterSpacing: 1, color: "rgba(255,255,255,0.35)", fontFamily: "-apple-system, Arial, sans-serif", textTransform: "uppercase" }}>
                Live · {new Date(metrics.lastUpdated).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" }).toUpperCase()}
              </span>
            </div>

            {/* 2×2 stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {STATS.map(({ label, value, teal }, i) => {
                const isBottomRow = i >= 2;
                const isRightCol = i % 2 === 1;
                return (
                  <div key={label} style={{
                    padding: "16px 16px",
                    borderBottom: isBottomRow ? "none" : "0.5px solid rgba(255,255,255,0.06)",
                    borderRight: isRightCol ? "none" : "0.5px solid rgba(255,255,255,0.06)",
                  }}>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700,
                      color: teal ? "#1D9E75" : "white",
                      margin: "0 0 4px", lineHeight: 1,
                    }}>
                      {value}
                    </p>
                    <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase", margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gradient divider ──────────────────────────────────── */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #534AB7 0%, #1D9E75 100%)" }} />

      {/* ── Fund Cards ────────────────────────────────────────── */}
      <section style={{ background: "#f5f4f9", padding: "48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#534AB7", margin: "0 0 8px", fontFamily: "-apple-system, Arial, sans-serif" }}>
              Our Funds
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#0d0b1a", margin: "0 0 6px" }}>
              Two Funds. One Mandate.
            </h2>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
              Disciplined investment management across global equities and Pacific markets.
            </p>
          </div>

          <div className="fund-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Fund I */}
            <div style={{ background: "white", border: "0.5px solid #e0dff5", borderRadius: 10, borderTop: "3px solid #534AB7", overflow: "hidden" }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: "#0d0b1a", margin: 0 }}>Ellice Growth Fund I</h3>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", background: "#EEEDFE", color: "#3C3489", borderRadius: 2, padding: "3px 8px", flexShrink: 0, marginLeft: 10, fontFamily: "-apple-system, Arial, sans-serif" }}>
                    Closed
                  </span>
                </div>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: "#534AB7", margin: "0 0 4px" }}>{metrics.fund1Irr}</p>
                <p style={{ fontSize: 10, color: "#999", margin: "0 0 14px", fontFamily: "-apple-system, Arial, sans-serif" }}>IRR since inception · Est. 2022</p>
                <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6, margin: "0 0 18px", fontFamily: "-apple-system, Arial, sans-serif" }}>
                  Our flagship fund established in 2022, investing across global equities, Pacific markets, and fixed income for long-term wealth creation.
                </p>
              </div>
              <div style={{ borderTop: "0.5px solid #f0effe", padding: "14px 24px" }}>
                <Link href="/login" style={{ fontSize: 11, fontWeight: 600, color: "#534AB7", textDecoration: "none", fontFamily: "-apple-system, Arial, sans-serif" }}>
                  Investor Access →
                </Link>
              </div>
            </div>

            {/* Fund II */}
            <div style={{ background: "white", border: "0.5px solid #e0dff5", borderRadius: 10, borderTop: "3px solid #1D9E75", overflow: "hidden" }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: "#0d0b1a", margin: 0 }}>Ellice Growth Fund II</h3>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", background: "#E1F5EE", color: "#085041", borderRadius: 2, padding: "3px 8px", flexShrink: 0, marginLeft: 10, fontFamily: "-apple-system, Arial, sans-serif" }}>
                    Active
                  </span>
                </div>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: "#0F6E56", margin: "0 0 4px" }}>{metrics.fund2ReturnYtd}</p>
                <p style={{ fontSize: 10, color: "#999", margin: "0 0 14px", fontFamily: "-apple-system, Arial, sans-serif" }}>2025 YTD return · Est. 2024</p>
                <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6, margin: "0 0 18px", fontFamily: "-apple-system, Arial, sans-serif" }}>
                  Our second fund continues the disciplined investment approach of Fund I, with an expanded focus on high-conviction equity positions across Pacific markets.
                </p>
              </div>
              <div style={{ borderTop: "0.5px solid #e1f5ee", padding: "14px 24px" }}>
                <Link href="/login" style={{ fontSize: 11, fontWeight: 600, color: "#0F6E56", textDecoration: "none", fontFamily: "-apple-system, Arial, sans-serif" }}>
                  Investor Access →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Ellice ────────────────────────────────────────── */}
      <section style={{ background: "white", padding: "48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#534AB7", margin: "0 0 8px", fontFamily: "-apple-system, Arial, sans-serif" }}>
              Why Ellice
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#0d0b1a", margin: 0 }}>
              What Sets Us Apart
            </h2>
          </div>

          <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {/* Card 1 */}
            <div style={{ background: "white", border: "0.5px solid #e8e7f5", borderRadius: 8, padding: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="1" width="6" height="6" rx="1" fill="#534AB7" />
                  <rect x="9" y="1" width="6" height="6" rx="1" fill="#534AB7" opacity="0.5" />
                  <rect x="1" y="9" width="6" height="6" rx="1" fill="#534AB7" opacity="0.5" />
                  <rect x="9" y="9" width="6" height="6" rx="1" fill="#534AB7" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, color: "#0d0b1a", margin: "0 0 8px" }}>Disciplined Process</h3>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
                A rigorous, research-driven investment framework focused on long-term value creation across Pacific markets and global equities.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{ background: "white", border: "0.5px solid #e8e7f5", borderRadius: 8, padding: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#534AB7" strokeWidth="1.5" fill="none" />
                  <path d="M5 8l2 2 4-4" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, color: "#0d0b1a", margin: "0 0 8px" }}>Full Transparency</h3>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
                Every investor has real-time access to their account, portfolio performance, and quarterly statements through our secure portal.
              </p>
            </div>

            {/* Card 3 — Pacific Roots (teal) */}
            <div style={{ background: "white", border: "0.5px solid #e8e7f5", borderRadius: 8, padding: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5 2 2 5 2 8s3 6 6 6 6-3 6-6-3-6-6-6z" fill="#0F6E56" opacity="0.2" />
                  <path d="M8 2C5 2 2 5 2 8s3 6 6 6 6-3 6-6-3-6-6-6z" stroke="#0F6E56" strokeWidth="1.2" fill="none" />
                  <path d="M8 5v3l2 2" stroke="#0F6E56" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700, color: "#0d0b1a", margin: "0 0 8px" }}>Pacific Roots</h3>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6, margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
                Founded by and for Pacific people — bringing institutional-grade investment management to communities across New Zealand, Australia, and the Pacific.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────────────────────── */}
      <section style={{ background: "#26215C", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 8px", fontFamily: "-apple-system, Arial, sans-serif" }}>
              Already an Investor?
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "white", margin: "0 0 6px" }}>
              Access your investor portal.
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>
              View your account, latest statement, and fund documents in one place.
            </p>
          </div>
          <Link href="/login" style={{
            padding: "12px 24px", borderRadius: 4, fontWeight: 600, fontSize: 11,
            background: "#534AB7", color: "white", textDecoration: "none",
            fontFamily: "-apple-system, Arial, sans-serif", flexShrink: 0, letterSpacing: 0.3,
          }}>
            Sign In →
          </Link>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .fund-grid { grid-template-columns: 1fr !important; }
          .why-grid  { grid-template-columns: 1fr !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </div>
  );
}
