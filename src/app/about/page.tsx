import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Ellice Investment Group",
  description: "Meet the team behind Ellice Investment Group.",
};

const TEAM = [
  {
    name: "Etekafa",
    role: "Fund Administrator & Managing Director",
    bio: "Leads fund operations, investor relations, and strategic direction of Ellice Growth Fund I. Committed to delivering transparent, disciplined investment management for Pacific investors.",
    initial: "E",
    email: "etekafa@elliceinvestmentgroup.com",
  },
  {
    name: "Ellice Capital Team",
    role: "Investment Committee",
    bio: "A dedicated team of investment professionals overseeing portfolio construction, risk management, and quarterly performance reporting across the fund's holdings.",
    initial: "IC",
    email: "support@elliceinvestmentgroup.com",
  },
];

const MILESTONES = [
  { year: "2022", event: "Ellice Growth Fund I established with founding investors" },
  { year: "2023", event: "Portfolio expanded across global equities and fixed income" },
  { year: "2024", event: "Investor portal launched with real-time portfolio access" },
  { year: "2025", event: "Full Year 2025 return: +20.4% · AUM crosses $100M milestone" },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0d1b2a, #1b3a5c)", padding: "80px 32px 96px", textAlign: "center", color: "white" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 16 }}>About Us</p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, margin: "0 0 20px", lineHeight: 1.2 }}>The People Behind the Fund</h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
            Ellice Investment Group is a Pacific-focused private investment fund built on trust, transparency, and long-term thinking.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: "72px 32px", background: "#f8f7f4" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 16 }}>Our Mission</p>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "#0d1b2a", margin: "0 0 24px" }}>Wealth Creation for Pacific Communities</h2>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            We believe every Pacific investor deserves access to institutional-grade investment management. Ellice Investment Group was founded to close that gap — providing disciplined portfolio management, full transparency, and personalised service to our investors.
          </p>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 12 }}>Our Team</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0d1b2a", margin: 0 }}>Leadership</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 32 }}>
            {TEAM.map(({ name, role, bio, initial, email }) => (
              <div key={name} style={{ background: "#f8f7f4", borderRadius: 20, padding: 36, border: "1px solid #eee" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #0d1b2a, #1b3a5c)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 22, fontWeight: 700, color: "#D4AF37" }}>
                  {initial}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0d1b2a", margin: "0 0 4px" }}>{name}</h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#D4AF37", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 16px" }}>{role}</p>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, margin: "0 0 20px" }}>{bio}</p>
                <a href={`mailto:${email}`} style={{ fontSize: 13, color: "#2D5A43", textDecoration: "none", fontWeight: 600 }}>
                  {email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: "#f8f7f4", padding: "72px 32px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 12 }}>History</p>
            <h2 style={{ fontSize: 32, fontWeight: 700, color: "#0d1b2a", margin: 0 }}>Our Journey</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 56, top: 0, bottom: 0, width: 2, background: "#e5e5e5" }} />
            {MILESTONES.map(({ year, event }, i) => (
              <div key={year} style={{ display: "flex", gap: 28, marginBottom: i < MILESTONES.length - 1 ? 36 : 0, position: "relative" }}>
                <div style={{ flexShrink: 0, width: 56, textAlign: "right" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#D4AF37" }}>{year}</span>
                </div>
                <div style={{ flexShrink: 0, width: 14, height: 14, borderRadius: "50%", background: "#2D5A43", border: "3px solid white", boxShadow: "0 0 0 2px #2D5A43", marginTop: 2, position: "relative", zIndex: 1 }} />
                <div style={{ flex: 1, paddingBottom: 8 }}>
                  <p style={{ fontSize: 15, color: "#333", lineHeight: 1.6, margin: 0 }}>{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "72px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { label: "Transparency",  body: "Full visibility into your account, holdings, and fund performance at all times." },
            { label: "Trust",         body: "Your capital is managed with the same care we would give our own." },
            { label: "Discipline",    body: "A repeatable, research-driven process — not speculation." },
            { label: "Community",     body: "Built by and for Pacific people, with a long-term commitment to the region." },
          ].map(({ label, body }) => (
            <div key={label} style={{ borderLeft: "4px solid #D4AF37", paddingLeft: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0d1b2a", margin: "0 0 8px" }}>{label}</h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
