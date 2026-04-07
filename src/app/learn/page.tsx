import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn — Ellice Investment Group",
  description: "Investment education, market insights, and videos from Ellice Investment Group.",
};

// ─── Edit these to add/update content ───────────────────────────────────────

const SOCIAL_LINKS = [
  {
    name: "YouTube",
    handle: "@ElliceInvestmentGroup",
    url: "https://www.youtube.com/@ElliceInvestmentGroup",
    description: "Watch our latest market insights, fund updates, and investment education videos.",
    icon: "▶",
    color: "#FF0000",
  },
  {
    name: "LinkedIn",
    handle: "Easter Tekafa",
    url: "https://www.linkedin.com/in/easterniko/",
    description: "Follow our Managing Director for investment commentary and Pacific market perspectives.",
    icon: "in",
    color: "#0077B5",
  },
  {
    name: "Instagram",
    handle: "@elliceinvestmentgroup",
    url: "https://www.instagram.com/elliceinvestmentgroup",
    description: "Short-form financial tips, behind-the-scenes, and Pacific community stories.",
    icon: "◉",
    color: "#E1306C",
  },
  {
    name: "Facebook",
    handle: "Ellice Investment Group",
    url: "https://www.facebook.com/elliceinvestmentgroup",
    description: "Community updates, articles, and announcements from Ellice Investment Group.",
    icon: "f",
    color: "#1877F2",
  },
];

// Add YouTube video IDs here (from the URL: youtube.com/watch?v=VIDEO_ID)
const FEATURED_VIDEOS: { id: string; title: string; description: string; category: string }[] = [
  // Example — replace with real video IDs:
  // { id: "dQw4w9WgXcQ", title: "How to Start Investing in 2025", description: "A beginner's guide to investing your first dollar.", category: "Beginner" },
  // { id: "abc123", title: "Pacific Market Update – Q1 2025", description: "Easter breaks down the key moves in Pacific markets.", category: "Market Update" },
];

const ARTICLES = [
  {
    title: "Why Pacific Investors Deserve Institutional-Grade Management",
    date: "2025",
    category: "Opinion",
    excerpt: "For too long, Pacific Island investors have been underserved by the financial industry. Ellice Investment Group was founded to change that — bringing disciplined, transparent fund management to the communities that need it most.",
    url: "#",
  },
  {
    title: "Understanding IRR: What It Means for Your Investment",
    date: "2025",
    category: "Education",
    excerpt: "Internal Rate of Return (IRR) is one of the most important metrics for evaluating fund performance. Here's how to interpret it and why it matters for your portfolio.",
    url: "#",
  },
  {
    title: "Ellice Growth Fund I: 2025 Annual Review",
    date: "2025",
    category: "Fund Update",
    excerpt: "A full-year review of Fund I performance, portfolio composition, key decisions made in 2025, and what we're focused on heading into 2026.",
    url: "#",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Beginner", "Market Update", "Fund Update", "Pacific Markets", "Education"];

export default function LearnPage() {
  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #13175c 0%, #2d2a8a 55%, #1a1760 100%)",
        padding: "72px 32px 88px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 16 }}>
            Learn & Educate
          </p>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, margin: "0 0 18px", lineHeight: 1.2 }}>
            Investment Education<br />From the Pacific
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto" }}>
            Videos, articles, and market insights from Easter Tekafa and the Ellice Investment Group team — designed to help Pacific communities build lasting wealth.
          </p>
        </div>
      </section>

      {/* Social media links */}
      <section style={{ padding: "64px 32px", background: "#f5f4f8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>Follow Along</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#13175c", margin: "0 0 10px" }}>Find Us Online</h2>
            <p style={{ fontSize: 14, color: "#666" }}>Follow Easter and the Ellice team for regular investment education and fund updates.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
            {SOCIAL_LINKS.map(({ name, handle, url, description, icon, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: 16,
                  padding: "28px 24px",
                  border: "1px solid #e8e8e8",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "box-shadow 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 900,
                    color: "white",
                    flexShrink: 0,
                  }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#13175c", margin: 0 }}>{name}</p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{handle}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 14px" }}>{description}</p>
                <span style={{ fontSize: 12, fontWeight: 600, color, display: "flex", alignItems: "center", gap: 4 }}>
                  Follow on {name} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section style={{ padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 10 }}>Video Library</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#13175c", margin: 0 }}>Watch & Learn</h2>
            </div>
            <a
              href="https://www.youtube.com/@ElliceInvestmentGroup"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: "#FF0000",
                color: "white",
                textDecoration: "none",
              }}
            >
              ▶ Subscribe on YouTube
            </a>
          </div>

          {FEATURED_VIDEOS.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {FEATURED_VIDEOS.map(({ id, title, description, category }) => (
                <div key={id} style={{ background: "white", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
                  <div style={{ position: "relative", paddingTop: "56.25%", background: "#13175c" }}>
                    <iframe
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      src={`https://www.youtube.com/embed/${id}`}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ padding: "20px 20px 24px" }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#534AB7",
                      background: "rgba(45,90,67,0.1)",
                      borderRadius: 100,
                      padding: "3px 9px",
                      display: "inline-block",
                      marginBottom: 10,
                    }}>{category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#13175c", margin: "0 0 8px", lineHeight: 1.4 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state — videos coming soon */
            <div style={{
              background: "#f5f4f8",
              borderRadius: 18,
              padding: "64px 40px",
              textAlign: "center",
              border: "2px dashed #ddd",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#13175c", margin: "0 0 10px" }}>Videos Coming Soon</h3>
              <p style={{ fontSize: 14, color: "#666", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.7 }}>
                Easter is creating investment education videos for Pacific communities.
                Subscribe to YouTube so you don&apos;t miss the first drop.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://www.youtube.com/@ElliceInvestmentGroup"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 22px", borderRadius: 8, fontWeight: 600, fontSize: 13, background: "#FF0000", color: "white", textDecoration: "none" }}
                >
                  ▶ Subscribe on YouTube
                </a>
                <a
                  href="https://www.linkedin.com/in/easterniko/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 22px", borderRadius: 8, fontWeight: 600, fontSize: 13, background: "#0077B5", color: "white", textDecoration: "none" }}
                >
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section style={{ padding: "64px 32px", background: "#f5f4f8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 10 }}>Insights & Articles</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#13175c", margin: 0 }}>Read & Learn</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {ARTICLES.map(({ title, date, category, excerpt, url }) => (
              <a
                key={title}
                href={url}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "28px 32px",
                  border: "1px solid #e8e8e8",
                  textDecoration: "none",
                  color: "inherit",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#534AB7",
                      background: "rgba(45,90,67,0.1)",
                      borderRadius: 100,
                      padding: "3px 9px",
                    }}>{category}</span>
                    <span style={{ fontSize: 12, color: "#bbb" }}>{date}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#13175c", margin: "0 0 8px", lineHeight: 1.35 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{excerpt}</p>
                </div>
                <span style={{ fontSize: 20, color: "#ddd", flexShrink: 0 }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section style={{ padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 10 }}>Topics We Cover</p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#13175c", margin: 0 }}>What You&apos;ll Learn</h2>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              "Pacific Market Insights",
              "Fund Performance Analysis",
              "Compound Growth",
              "IRR & Investment Metrics",
              "Portfolio Diversification",
              "NZ & Australian Markets",
              "Global Equities",
              "Getting Started Investing",
              "Wealth Building for Families",
              "Fixed Income Basics",
            ].map((t) => (
              <span key={t} style={{
                padding: "9px 18px",
                borderRadius: 100,
                fontSize: 13,
                fontWeight: 500,
                background: "#f5f4f8",
                border: "1px solid #e8e8e8",
                color: "#444",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / notify CTA */}
      <section style={{
        background: "linear-gradient(135deg, #534AB7, #4840a8)",
        padding: "72px 32px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px" }}>Don&apos;t Miss New Content</h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
            Follow Ellice Investment Group on social media to get notified when new videos, articles, and market updates are posted.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {SOCIAL_LINKS.map(({ name, url, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  background: color,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category filters hint */}
      <div style={{ display: "none" }}>
        {CATEGORIES.map((c) => <span key={c}>{c}</span>)}
      </div>

      <PublicFooter />
    </div>
  );
}
