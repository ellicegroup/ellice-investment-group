"use client";
import { useEffect, useState } from "react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import type { MarketData, MarketIndex } from "@/lib/marketTypes";

function IndexCard({ idx }: { idx: MarketIndex }) {
  const up = idx.changePct >= 0;
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "28px 24px", border: "1px solid #eee", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#888", margin: "0 0 4px" }}>{idx.region}</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#13175c", margin: 0 }}>{idx.name}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100, background: up ? "#f0fdf4" : "#fef2f2", color: up ? "#15803d" : "#dc2626" }}>
          {up ? "▲" : "▼"} {idx.region}
        </span>
      </div>
      <p style={{ fontSize: 32, fontWeight: 700, color: "#13175c", margin: "0 0 8px", fontVariantNumeric: "tabular-nums" }}>
        {idx.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: up ? "#15803d" : "#dc2626", margin: 0 }}>
        {up ? "+" : ""}{idx.change.toFixed(2)} ({up ? "+" : ""}{idx.changePct.toFixed(2)}%)
      </p>
    </div>
  );
}

const MARKET_COMMENTARY = [
  {
    title: "Global Equities Rally on Rate Optimism",
    body: "Major indices advanced as central bank commentary signalled a more accommodative stance heading into Q2, boosting financials and technology sectors.",
    tag: "Equities",
    date: "Apr 2026",
  },
  {
    title: "Pacific Markets Resilient Amid Volatility",
    body: "NZX 50 and ASX 200 both held gains, supported by commodity strength and stable domestic economic data across the region.",
    tag: "Pacific",
    date: "Apr 2026",
  },
  {
    title: "Fixed Income Stabilises After Rate Moves",
    body: "Treasury yields retraced from recent highs as inflation data came in line with expectations, providing support for fixed income allocations.",
    tag: "Fixed Income",
    date: "Mar 2026",
  },
];

export default function MarketPage() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(300);

  function load() {
    setLoading(true);
    fetch("/api/market")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); setCountdown(300); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 300000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(tick);
  }, []);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #13175c, #2d2a8a)", padding: "72px 32px 88px", color: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: "#D4AF37", marginBottom: 12 }}>Live Market Data</p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>Market Updates</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              {data ? `Last updated ${new Date(data.lastUpdated).toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" })} · Refreshes in ${mins}:${String(secs).padStart(2, "0")}` : "Loading market data…"}
            </p>
          </div>
          <button
            onClick={load}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            ↻ Refresh
          </button>
        </div>
      </section>

      {/* Indices grid */}
      <section style={{ background: "#f5f4f8", padding: "48px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#888", marginBottom: 20 }}>Major Indices</p>
          {loading && !data ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>Loading market data…</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {data?.indices.map((idx) => <IndexCard key={idx.symbol} idx={idx} />)}
            </div>
          )}
          <p style={{ fontSize: 11, color: "#aaa", marginTop: 16 }}>
            Data sourced from Yahoo Finance · 15-minute delay · For informational purposes only
          </p>
        </div>
      </section>

      {/* Sector performance */}
      <section style={{ padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#888", marginBottom: 8 }}>Fund Portfolio</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#13175c", margin: "0 0 32px" }}>Sector Allocation</h2>
          <div style={{ background: "#f5f4f8", borderRadius: 20, padding: "32px 36px" }}>
            {[
              { label: "Financials",   pct: 53.2, sub: "BRK.B, JPM, Visa",    color: "#D4AF37" },
              { label: "Technology",   pct: 30.5, sub: "AAPL, Microsoft",      color: "#534AB7" },
              { label: "Energy",       pct: 5.3,  sub: "Exxon Mobil",          color: "#7B74D4" },
              { label: "Fixed Income", pct: 2.5,  sub: "US Treasury 3M",       color: "#aaa"    },
              { label: "Cash & Other", pct: 8.5,  sub: "Cash equivalents",     color: "#ccc"    },
            ].map(({ label, pct, sub, color }) => (
              <div key={label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{label}</span>
                    <span style={{ fontSize: 12, color: "#888", marginLeft: 10 }}>{sub}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color }}>{pct}%</span>
                </div>
                <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 4 }}>
                  <div style={{ height: 8, width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commentary */}
      <section style={{ background: "#f5f4f8", padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#888", marginBottom: 8 }}>Insights</p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#13175c", margin: "0 0 32px" }}>Market Commentary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {MARKET_COMMENTARY.map(({ title, body, tag, date }) => (
              <div key={title} style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #eee", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "#13175c", color: "#D4AF37" }}>{tag}</span>
                  <span style={{ fontSize: 11, color: "#aaa", padding: "3px 0" }}>{date}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#13175c", margin: "0 0 10px", lineHeight: 1.4 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor CTA */}
      <section style={{ background: "linear-gradient(135deg, #13175c, #2d2a8a)", padding: "64px 32px", textAlign: "center", color: "white" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 14px" }}>View Your Portfolio Performance</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
          Investors can see live portfolio data and their account value in the investor portal.
        </p>
        <a href="/login" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14, background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#13175c", textDecoration: "none" }}>
          Investor Portal →
        </a>
      </section>

      <PublicFooter />
    </div>
  );
}
