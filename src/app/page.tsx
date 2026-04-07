import Link from "next/link";
import Image from "next/image";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getFundMetrics } from "@/lib/metricsSheets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ellice Investment Group — Pacific-Focused Investment Management",
  description:
    "Ellice Investment Group manages two private funds delivering institutional-grade returns for investors across the Pacific and beyond.",
};

// Revalidate every 5 minutes so metrics stay live
export const revalidate = 300;

export default async function HomePage() {
  const metrics = await getFundMetrics();

  const STATS = [
    {
      label: "Fund I IRR",
      value: metrics.fund1Irr,
      note: "Since inception (2022)",
      highlight: true,
    },
    {
      label: "Fund I 2025 Return",
      value: metrics.fund1ReturnYtd,
      note: "Full year 2025",
      highlight: true,
    },
    {
      label: "S&P 500 2025",
      value: metrics.sp500ReturnYtd,
      note: "Benchmark comparison",
      highlight: false,
    },
    {
      label: "Active Investors",
      value: String(metrics.activeInvestors),
      note: "Across both funds",
      highlight: false,
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(160deg, #0a1628 0%, #0d2236 50%, #0a1e14 100%)",
        color: "white",
        padding: "80px 32px 100px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Centered prominent logo */}
          <div style={{ marginBottom: 40 }}>
            <Image
              src="/logo.svg"
              alt="Ellice Investment Group"
              width={220}
              height={56}
              style={{ filter: "brightness(0) invert(1)", margin: "0 auto" }}
              priority
            />
          </div>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.35)",
            borderRadius: 100,
            padding: "6px 18px",
            marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, color: "#D4AF37", textTransform: "uppercase" }}>
              Two Funds Under Management
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(34px, 5vw, 58px)",
            fontWeight: 700,
            lineHeight: 1.13,
            margin: "0 0 22px",
            letterSpacing: -0.5,
          }}>
            Pacific-Focused Investment<br />
            <span style={{ color: "#D4AF37" }}>Built for the Long Term</span>
          </h1>

          <p style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.75,
            maxWidth: 560,
            margin: "0 auto 48px",
          }}>
            Ellice Investment Group manages Ellice Growth Fund I and II — delivering
            institutional-grade returns for Pacific investors and beyond.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              padding: "13px 30px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              background: "linear-gradient(135deg, #c9a84c, #e8cd6a)",
              color: "#0a1628",
              textDecoration: "none",
              letterSpacing: 0.2,
            }}>
              Investor Portal →
            </Link>
            <Link href="/about" style={{
              padding: "13px 30px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              background: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.85)",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Metrics ── */}
      <section style={{ background: "#f5f4f1", padding: "56px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#888", margin: 0 }}>
              Fund Performance
            </p>
            <p style={{ fontSize: 11, color: "#aaa", margin: 0 }}>
              Live · Updated {new Date(metrics.lastUpdated).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
          }}>
            {STATS.map(({ label, value, note, highlight }) => (
              <div key={label} style={{
                background: "white",
                borderRadius: 14,
                padding: "28px 24px",
                border: highlight ? "1px solid rgba(45,90,67,0.2)" : "1px solid #e8e8e8",
                borderTop: highlight ? "3px solid #2D5A43" : "3px solid #e8e8e8",
              }}>
                <p style={{ fontSize: 38, fontWeight: 700, color: highlight ? "#2D5A43" : "#1a1a1a", margin: "0 0 6px", letterSpacing: -1 }}>
                  {value}
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#222", margin: "0 0 3px" }}>{label}</p>
                <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two Funds ── */}
      <section style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>
              Our Funds
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0a1628", margin: "0 0 14px" }}>
              Two Funds. One Mandate.
            </h2>
            <p style={{ fontSize: 15, color: "#666", maxWidth: 520, margin: "0 auto" }}>
              Disciplined investment management across global equities and Pacific markets.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              {
                name: "Ellice Growth Fund I",
                status: "Closed",
                statusColor: "#D4AF37",
                irr: metrics.fund1Irr,
                return2025: metrics.fund1ReturnYtd,
                since: "2022",
                desc: "Our flagship fund established in 2022, investing across global equities, Pacific markets, and fixed income for long-term wealth creation.",
              },
              {
                name: "Ellice Growth Fund II",
                status: "Active",
                statusColor: "#2D5A43",
                irr: metrics.fund2ReturnYtd,
                return2025: metrics.fund2ReturnYtd,
                since: "2024",
                desc: "Our second fund continues the disciplined investment approach of Fund I, with an expanded focus on high-conviction equity positions.",
              },
            ].map((fund) => (
              <div key={fund.name} style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #ebebeb",
                overflow: "hidden",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}>
                <div style={{ background: "linear-gradient(135deg, #0a1628, #0d2236)", padding: "28px 28px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0, lineHeight: 1.3 }}>{fund.name}</h3>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: fund.statusColor,
                      background: `${fund.statusColor}22`,
                      border: `1px solid ${fund.statusColor}55`,
                      borderRadius: 100,
                      padding: "3px 10px",
                      flexShrink: 0,
                      marginLeft: 12,
                    }}>{fund.status}</span>
                  </div>
                  <div style={{ display: "flex", gap: 24 }}>
                    <div>
                      <p style={{ fontSize: 26, fontWeight: 700, color: "#D4AF37", margin: "0 0 2px" }}>{fund.irr}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>IRR / 2025 Return</p>
                    </div>
                    <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: 24 }}>
                      <p style={{ fontSize: 26, fontWeight: 700, color: "white", margin: "0 0 2px" }}>{fund.since}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: 0 }}>Inception</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "24px 28px 28px" }}>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "0 0 20px" }}>{fund.desc}</p>
                  <Link href="/login" style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#2D5A43",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    Investor Access →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Ellice ── */}
      <section style={{ background: "#f5f4f1", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>Why Ellice</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0a1628", margin: 0 }}>What Sets Us Apart</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                icon: "◈",
                title: "Disciplined Process",
                body: "A rigorous, research-driven investment framework focused on long-term value creation across Pacific markets and global equities.",
              },
              {
                icon: "◻",
                title: "Full Transparency",
                body: "Every investor has real-time access to their account, portfolio performance, and quarterly statements through our secure portal.",
              },
              {
                icon: "≡",
                title: "Pacific Roots",
                body: "Founded by and for Pacific people — bringing institutional-grade investment management to communities across New Zealand, Australia, and the region.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} style={{
                background: "white",
                borderRadius: 16,
                padding: "32px 28px",
                border: "1px solid #e8e8e8",
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "#0a1628",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  fontSize: 18,
                  color: "#D4AF37",
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0a1628", margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #2D5A43 0%, #1a3828 100%)",
        padding: "80px 32px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 14px" }}>Already an Investor?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 36 }}>
            Access your account, view your latest statement, and download fund documents through the secure investor portal.
          </p>
          <Link href="/login" style={{
            display: "inline-block",
            padding: "13px 36px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            background: "linear-gradient(135deg, #c9a84c, #e8cd6a)",
            color: "#0a1628",
            textDecoration: "none",
          }}>
            Sign In to Investor Portal →
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
