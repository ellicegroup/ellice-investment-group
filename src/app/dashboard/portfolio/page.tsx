"use client";
import { useEffect, useState } from "react";
import type { PortfolioSummary, PortfolioHolding } from "@/lib/googleSheets";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#6366f1",
  Financials: "#c9a84c",
  Energy: "#10b981",
  "Fixed Income": "#64748b",
  "Health Care": "#ec4899",
  "Consumer Discretionary": "#f97316",
  Other: "#94a3b8",
};

function sectorColor(sector: string) {
  return SECTOR_COLORS[sector] ?? SECTOR_COLORS.Other;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [sortKey, setSortKey] = useState<keyof PortfolioHolding>("weight");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function fetchPortfolio() {
    setLoading(true);
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((p) => {
        setPortfolio(p);
        setLastFetch(new Date());
        setLoading(false);
      });
  }

  useEffect(() => { fetchPortfolio(); }, []);

  function toggleSort(key: keyof PortfolioHolding) {
    if (sortKey === key) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  }

  const sorted = portfolio?.holdings
    ? [...portfolio.holdings].sort((a, b) => {
        const av = a[sortKey] as number;
        const bv = b[sortKey] as number;
        return sortDir === "desc" ? bv - av : av - bv;
      })
    : [];

  // Group by sector for the breakdown bar
  const sectorMap: Record<string, number> = {};
  portfolio?.holdings?.forEach((h) => {
    sectorMap[h.sector] = (sectorMap[h.sector] ?? 0) + h.weight;
  });
  const sectors = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);

  function SortIcon({ k }: { k: keyof PortfolioHolding }) {
    if (sortKey !== k) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="ml-1" style={{ color: "#c9a84c" }}>{sortDir === "desc" ? "↓" : "↑"}</span>;
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Active Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">
            Live data from the fund's investment ledger
            {lastFetch && ` · refreshed ${lastFetch.toLocaleTimeString()}`}
          </p>
        </div>
        <button
          onClick={fetchPortfolio}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition disabled:opacity-50"
          style={{ background: "#0d1b2a" }}
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {loading && !portfolio ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-sm">Loading portfolio data…</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total AUM", value: fmt(portfolio?.totalValue ?? 0) },
              { label: "Total Cost Basis", value: fmt(portfolio?.totalCost ?? 0) },
              {
                label: "Unrealized P&L",
                value: fmt(portfolio?.totalGainLoss ?? 0),
                colored: true,
                positive: (portfolio?.totalGainLoss ?? 0) >= 0,
              },
              {
                label: "Return",
                value: pct(portfolio?.totalGainLossPercent ?? 0),
                colored: true,
                positive: (portfolio?.totalGainLossPercent ?? 0) >= 0,
              },
            ].map(({ label, value, colored, positive }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
                <p className={`text-xl font-semibold ${colored ? (positive ? "text-emerald-600" : "text-red-500") : "text-gray-900"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Sector breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 text-sm mb-4">Sector Allocation</h2>
            {/* Stacked bar */}
            <div className="flex h-4 rounded-full overflow-hidden mb-4">
              {sectors.map(([sector, weight]) => (
                <div
                  key={sector}
                  style={{ width: `${weight}%`, background: sectorColor(sector) }}
                  title={`${sector}: ${weight.toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {sectors.map(([sector, weight]) => (
                <div key={sector} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: sectorColor(sector) }} />
                  <span className="text-xs text-gray-600">{sector}</span>
                  <span className="text-xs font-semibold text-gray-900">{weight.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Holdings ({portfolio?.holdings?.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      { label: "Ticker", key: "ticker" as keyof PortfolioHolding },
                      { label: "Name / Sector", key: "name" as keyof PortfolioHolding },
                      { label: "Shares", key: "shares" as keyof PortfolioHolding },
                      { label: "Avg Cost", key: "avgCost" as keyof PortfolioHolding },
                      { label: "Price", key: "currentPrice" as keyof PortfolioHolding },
                      { label: "Market Value", key: "marketValue" as keyof PortfolioHolding },
                      { label: "Gain / Loss", key: "gainLoss" as keyof PortfolioHolding },
                      { label: "Return", key: "gainLossPercent" as keyof PortfolioHolding },
                      { label: "Weight", key: "weight" as keyof PortfolioHolding },
                    ].map(({ label, key }) => (
                      <th
                        key={key}
                        onClick={() => ["ticker", "name"].includes(key) ? null : toggleSort(key)}
                        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap ${!["ticker", "name"].includes(key) ? "cursor-pointer hover:text-gray-600" : ""}`}
                      >
                        {label}
                        {!["ticker", "name"].includes(key) && <SortIcon k={key} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((h, i) => (
                    <tr key={h.ticker} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ background: sectorColor(h.sector) }}>
                            {h.ticker.slice(0, 1)}
                          </div>
                          <span className="font-semibold text-gray-900">{h.ticker}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-900 font-medium">{h.name}</p>
                        <p className="text-xs text-gray-400">{h.sector}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{h.shares.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">{fmtPrice(h.avgCost)}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{fmtPrice(h.currentPrice)}</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{fmt(h.marketValue)}</td>
                      <td className={`px-4 py-3 font-medium ${h.gainLoss >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {h.gainLoss >= 0 ? "+" : ""}{fmt(h.gainLoss)}
                      </td>
                      <td className={`px-4 py-3 font-semibold ${h.gainLossPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {pct(h.gainLossPercent)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: 40 }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(h.weight, 100)}%`, background: sectorColor(h.sector) }} />
                          </div>
                          <span className="text-xs text-gray-600 font-medium w-10 text-right">{h.weight.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
