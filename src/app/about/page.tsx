import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Ellice Investment Group",
  description: "Meet the team behind Ellice Investment Group.",
};

const MILESTONES = [
  { year: "2022", event: "Ellice Growth Fund I established with founding investors across the Pacific" },
  { year: "2023", event: "Portfolio expanded across global equities, fixed income, and Pacific-listed securities" },
  { year: "2024", event: "Investor portal launched with real-time portfolio access. Ellice Growth Fund II launched." },
  { year: "2025", event: "Fund I delivers +20.4% full-year return. Fund II secures active investor base." },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #13175c 0%, #2d2a8a 60%, #1a1760 100%)",
        padding: "80px 32px 100px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 16 }}>About Us</p>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 700, margin: "0 0 20px", lineHeight: 1.2 }}>
            The People Behind the Fund
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
            Ellice Investment Group is a Pacific-focused private investment firm built on trust,
            transparency, and long-term thinking — managing two funds for investors across the Pacific and beyond.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "72px 32px", background: "#f5f4f8" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 16 }}>Our Mission</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#13175c", margin: "0 0 20px" }}>
            Wealth Creation for Pacific Communities
          </h2>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            We believe every Pacific investor deserves access to institutional-grade investment management.
            Ellice Investment Group was founded to close that gap — providing disciplined portfolio management,
            full transparency, and personalised service through two dedicated funds.
          </p>
        </div>
      </section>

      {/* Investment Approach */}
      <section style={{ padding: "72px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Label + heading */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 16 }}>Investment Philosophy</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#13175c", margin: "0 0 20px", lineHeight: 1.25 }}>
              Capital with Conviction. Patience with Purpose.
            </h2>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85, maxWidth: 620, margin: "0 auto" }}>
              Ellice Capital Group takes a concentrated, thesis-driven approach to long-term wealth creation.
              Rather than chasing broad diversification, we build focused portfolios around durable structural
              trends — selecting a small number of high-conviction positions we understand deeply and hold with discipline.
            </p>
          </div>

          {/* 2×2 Pillar cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { title: "Concentrated Positions", body: "We hold fewer names and know each one well. Quality and conviction matter more than quantity." },
              { title: "Macro-Informed",          body: "Portfolio construction is grounded in global structural themes — energy transitions, technology infrastructure, and emerging market growth." },
              { title: "Long-Term Horizon",       body: "We invest for multi-year compounding, not short-term movements. Tax discipline and timing are part of the return equation." },
              { title: "Disciplined Deployment",  body: "Capital is deployed in tranches as conviction builds, with a permanent liquidity reserve maintained at all times." },
            ].map(({ title, body }) => (
              <div key={title} style={{
                background: "white",
                borderRadius: 14,
                border: "1px solid #ebebeb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                padding: "28px 28px 28px 24px",
                borderTop: "3px solid #534AB7",
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#13175c", margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>

          {/* Pull quote — gold left border, matching team card accent bar style */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "6px 1fr",
            gap: 0,
            background: "white",
            borderRadius: 14,
            border: "1px solid #ebebeb",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            overflow: "hidden",
            marginBottom: 28,
          }}>
            <div style={{ background: "linear-gradient(180deg, #D4AF37, #c9a84c)" }} />
            <div style={{ padding: "28px 32px" }}>
              <p style={{ fontSize: 16, fontStyle: "italic", color: "#333", lineHeight: 1.85, margin: "0 0 14px" }}>
                &ldquo;We call our framework Carbon Capital — an approach built on the idea that dense, high-energy
                positions generate compounding returns over time, just as carbon does in nature.&rdquo;
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#D4AF37", margin: 0, letterSpacing: 0.3 }}>
                — Easter Tekafa, Founder &amp; Managing Director
              </p>
            </div>
          </div>

          {/* Closing line */}
          <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", margin: 0, letterSpacing: 0.2 }}>
            Drawing on institutional experience across private equity, sovereign wealth, and Pacific regional development finance.
          </p>

        </div>
      </section>

      {/* Managing Director */}
      <section style={{ padding: "80px 32px", background: "#f5f4f8" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>Leadership</p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: "#13175c", margin: 0 }}>Our Team</h2>
          </div>

          {/* Easter Tekafa - MD card */}
          <div style={{
            background: "white",
            borderRadius: 20,
            border: "1px solid #ebebeb",
            overflow: "hidden",
            boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
            marginBottom: 28,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 0 }}>
              {/* Left accent bar */}
              <div style={{ width: 6, background: "linear-gradient(180deg, #D4AF37, #534AB7)" }} />
              <div style={{ padding: "40px 40px 40px 36px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #13175c, #2d2a8a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#D4AF37",
                    flexShrink: 0,
                  }}>
                    ET
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: "#13175c", margin: 0 }}>Easter Tekafa</h3>
                      <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#D4AF37",
                        background: "rgba(212,175,55,0.1)",
                        border: "1px solid rgba(212,175,55,0.3)",
                        borderRadius: 100,
                        padding: "3px 10px",
                      }}>
                        Queen&apos;s Young Leader 2016
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#534AB7", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 18px" }}>
                      Founder &amp; Managing Director
                    </p>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: "0 0 16px" }}>
                      Easter Tekafa is the Founder and Managing Director of Ellice Investment Group. He brings
                      deep institutional investment experience from roles across Goldman Sachs (Asset Management),
                      Alter Domus (global fund services), Mercato Partners (venture capital), and BDO (audit &amp; assurance).
                    </p>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: "0 0 20px" }}>
                      A proud Pacific Islander from Tuvalu and recipient of the Queen&apos;s Young Leader Award (2016),
                      Easter founded Ellice Investment Group to bring world-class fund management to Pacific communities.
                      He holds a Master of Accountancy from the University of Utah and a Bachelor of Accounting
                      from Brigham Young University–Hawaii.
                    </p>
                    <a
                      href="mailto:etekafa@elliceinvestmentgroup.com"
                      style={{ fontSize: 13, color: "#534AB7", textDecoration: "none", fontWeight: 600 }}
                    >
                      etekafa@elliceinvestmentgroup.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Committee */}
          <div style={{
            background: "#f5f4f8",
            borderRadius: 16,
            padding: "32px 36px",
            border: "1px solid #e8e8e8",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #13175c, #2d2a8a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#D4AF37",
                flexShrink: 0,
              }}>
                IC
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#13175c", margin: "0 0 4px" }}>Investment Committee</h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#D4AF37", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Ellice Capital Team</p>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, margin: "0 0 14px" }}>
                  A dedicated team of investment professionals overseeing portfolio construction, risk management,
                  and quarterly performance reporting across both fund&apos;s holdings.
                </p>
                <a href="mailto:support@elliceinvestmentgroup.com" style={{ fontSize: 13, color: "#534AB7", textDecoration: "none", fontWeight: 600 }}>
                  support@elliceinvestmentgroup.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "#f5f4f8", padding: "72px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>History</p>
            <h2 style={{ fontSize: 30, fontWeight: 700, color: "#13175c", margin: 0 }}>Our Journey</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 56, top: 8, bottom: 8, width: 2, background: "#ddd" }} />
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year} style={{ display: "flex", gap: 28, marginBottom: i < MILESTONES.length - 1 ? 36 : 0, position: "relative" }}>
                <div style={{ flexShrink: 0, width: 56, textAlign: "right" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37" }}>{year}</span>
                </div>
                <div style={{
                  flexShrink: 0,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: "#534AB7",
                  border: "3px solid #f5f4f8",
                  boxShadow: "0 0 0 2px #534AB7",
                  marginTop: 2,
                  position: "relative",
                  zIndex: 1,
                }} />
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <p style={{ fontSize: 15, color: "#333", lineHeight: 1.65, margin: 0 }}>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
          {[
            { label: "Transparency", body: "Full visibility into your account, holdings, and fund performance at all times." },
            { label: "Trust", body: "Your capital is managed with the same care and discipline we would give our own." },
            { label: "Discipline", body: "A repeatable, research-driven process — not speculation or short-term thinking." },
            { label: "Community", body: "Built by and for Pacific people, with a long-term commitment to the region." },
          ].map(({ label, body }) => (
            <div key={label} style={{ borderLeft: "3px solid #D4AF37", paddingLeft: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#13175c", margin: "0 0 8px" }}>{label}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
