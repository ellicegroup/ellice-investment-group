import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { getPortfolioData } from "@/lib/portfolioSheets";
import type { Position, FundPortfolio } from "@/lib/portfolioSheets";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — Ellice Investment Group",
  description: "Portfolio holdings and sector allocation for Ellice Growth Fund I and II.",
};

export const revalidate = 300;

// ── SVG Donut Chart ──────────────────────────────────────────────────────────

function DonutChart({ positions, size = 220 }: { positions: Position[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = outerR * 0.58;
  const total = positions.reduce((s, p) => s + p.weight, 0);

  // Build arc slices
  const slices: { d: string; color: string; position: Position }[] = [];
  let startAngle = -Math.PI / 2; // start at top

  positions.forEach((pos) => {
    const pct = pos.weight / total;
    const sweep = pct * 2 * Math.PI;
    const endAngle = startAngle + sweep;

    const x1o = cx + outerR * Math.cos(startAngle);
    const y1o = cy + outerR * Math.sin(startAngle);
    const x2o = cx + outerR * Math.cos(endAngle);
    const y2o = cy + outerR * Math.sin(endAngle);
    const x1i = cx + innerR * Math.cos(endAngle);
    const y1i = cy + innerR * Math.sin(endAngle);
    const x2i = cx + innerR * Math.cos(startAngle);
    const y2i = cy + innerR * Math.sin(startAngle);
    const large = sweep > Math.PI ? 1 : 0;

    const d = [
      `M ${x1o.toFixed(2)} ${y1o.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${x2o.toFixed(2)} ${y2o.toFixed(2)}`,
      `L ${x1i.toFixed(2)} ${y1i.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${x2i.toFixed(2)} ${y2i.toFixed(2)}`,
      "Z",
    ].join(" ");

    slices.push({ d, color: pos.color, position: pos });
    startAngle = endAngle;
  });

  // Top position by weight for center label
  const top = positions.reduce((a, b) => (a.weight > b.weight ? a : b));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {slices.map(({ d, color, position }) => (
        <path
          key={position.ticker}
          d={d}
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
      ))}
      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#13175c" fontFamily="Georgia, serif">
        {top.ticker}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="11" fill="#666" fontFamily="-apple-system, Arial, sans-serif">
        {top.weight.toFixed(1)}%
      </text>
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="9" fill="#aaa" fontFamily="-apple-system, Arial, sans-serif">
        largest
      </text>
    </svg>
  );
}

// ── Fund Card ────────────────────────────────────────────────────────────────

function FundCard({ fund, accentColor }: { fund: FundPortfolio; accentColor: string }) {
  const total = fund.positions.reduce((s, p) => s + p.weight, 0);

  // Group by sector for summary
  const sectors: Record<string, number> = {};
  fund.positions.forEach((p) => {
    sectors[p.sector] = (sectors[p.sector] || 0) + p.weight;
  });
  const sectorList = Object.entries(sectors).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ background: "white", border: "0.5px solid #e0dff5", borderRadius: 12, borderTop: `3px solid ${accentColor}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "0.5px solid #f0effe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: accentColor, margin: "0 0 6px", fontFamily: "-apple-system, Arial, sans-serif" }}>
              {fund.positions[0]?.ticker ? "Live Holdings" : "Portfolio"}
            </p>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: "#0d0b1a", margin: "0 0 2px" }}>{fund.fund}</h3>
            <p style={{ fontSize: 10, color: "#aaa", margin: 0, fontFamily: "-apple-system, Arial, sans-serif" }}>As of {fund.asOf}</p>
          </div>
          <span style={{ fontSize: 9, background: accentColor === "#534AB7" ? "#EEEDFE" : "#E1F5EE", color: accentColor === "#534AB7" ? "#3C3489" : "#085041", borderRadius: 2, padding: "3px 8px", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "-apple-system, Arial, sans-serif" }}>
            {accentColor === "#534AB7" ? "Closed" : "Active"}
          </span>
        </div>
      </div>

      {/* Chart + legend */}
      <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center" }}>
        <DonutChart positions={fund.positions} size={200} />

        {/* Position list */}
        <div>
          {fund.positions.map((pos) => (
            <div key={pos.ticker} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: pos.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#13175c", fontFamily: "-apple-system, Arial, sans-serif" }}>{pos.ticker}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#13175c", fontFamily: "-apple-system, Arial, sans-serif" }}>{pos.weight.toFixed(1)}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                  <span style={{ fontSize: 10, color: "#888", fontFamily: "-apple-system, Arial, sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{pos.name}</span>
                  <span style={{ fontSize: 9, color: "#bbb", fontFamily: "-apple-system, Arial, sans-serif", flexShrink: 0, marginLeft: 4 }}>{pos.sector}</span>
                </div>
                {/* Weight bar */}
                <div style={{ height: 3, background: "#f0effe", borderRadius: 2, marginTop: 4 }}>
                  <div style={{ height: 3, width: `${(pos.weight / total) * 100}%`, background: pos.color, borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector breakdown footer */}
      <div style={{ borderTop: "0.5px solid #f0effe", padding: "14px 24px", background: "#fafafe" }}>
        <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#aaa", margin: "0 0 10px", fontFamily: "-apple-system, Arial, sans-serif" }}>Sector Allocation</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
          {sectorList.map(([sector, pct]) => (
            <div key={sector} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#13175c", fontFamily: "-apple-system, Arial, sans-serif" }}>{pct.toFixed(1)}%</span>
              <span style={{ fontSize: 10, color: "#888", fontFamily: "-apple-system, Arial, sans-serif" }}>{sector}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function PortfolioPage() {
  const { fund1, fund2 } = await getPortfolioData();

  return (
    <div style={{ fontFamily: "-apple-system, Arial, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{ background: "#0d0b1a", padding: "56px 48px 48px", color: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#534AB7", margin: "0 0 10px", fontFamily: "-apple-system, Arial, sans-serif" }}>
            Portfolio
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, color: "white", margin: "0 0 12px", lineHeight: 1.2 }}>
            Holdings & Allocation
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 0 0" }}>
            Concentrated, high-conviction positions across Ellice Growth Fund I and II — updated quarterly from fund reporting.
          </p>
        </div>
      </section>

      {/* Gradient divider */}
      <div style={{ height: 2, background: "linear-gradient(90deg, #534AB7 0%, #1D9E75 100%)" }} />

      {/* Fund charts */}
      <section style={{ background: "#f5f4f9", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <FundCard fund={fund1} accentColor="#534AB7" />
            <FundCard fund={fund2} accentColor="#1D9E75" />
          </div>
        </div>
      </section>

      {/* Combined sector view */}
      <section style={{ background: "white", padding: "40px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, color: "#534AB7", margin: "0 0 8px", fontFamily: "-apple-system, Arial, sans-serif" }}>
            Combined View
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#0d0b1a", margin: "0 0 24px" }}>
            All Positions — Fund I
          </h2>

          {/* Bar chart for Fund I */}
          <div style={{ background: "#f5f4f9", borderRadius: 10, padding: "24px 28px" }}>
            {fund1.positions.map((pos) => {
              const total = fund1.positions.reduce((s, p) => s + p.weight, 0);
              return (
                <div key={pos.ticker} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#13175c", marginRight: 8 }}>{pos.ticker}</span>
                      <span style={{ fontSize: 11, color: "#888" }}>{pos.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: pos.color }}>{pos.weight.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(0,0,0,0.05)", borderRadius: 4 }}>
                    <div style={{ height: 8, width: `${(pos.weight / total) * 100}%`, background: pos.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section style={{ background: "#f5f4f9", padding: "20px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ fontSize: 10, color: "#bbb", margin: 0, lineHeight: 1.6 }}>
            Portfolio data is updated quarterly from fund PCAP reporting. Weightings reflect approximate allocation as of the last reporting period and may not reflect intra-quarter changes.
            This page is for informational purposes only and does not constitute investment advice.
          </p>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
