"use client";
import { useEffect, useState } from "react";
import type { Investor, Statement } from "@/lib/investors";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function StatementRow({ s, expanded, onToggle }: { s: Statement; expanded: boolean; onToggle: () => void }) {
  const pos = s.returnPercent >= 0;
  return (
    <>
      <tr
        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
        onClick={onToggle}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-xs">{expanded ? "▼" : "▶"}</span>
            <span className="font-medium text-gray-900">{s.period}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(s.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
        <td className="px-6 py-4 text-gray-700">{fmt(s.openingBalance)}</td>
        <td className="px-6 py-4 font-semibold text-gray-900">{fmt(s.closingBalance)}</td>
        <td className={`px-6 py-4 font-medium ${s.gainLoss >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {s.gainLoss >= 0 ? "+" : ""}{fmt(s.gainLoss)}
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${pos ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
            {pct(s.returnPercent)}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Opening Balance</p>
                <p className="font-semibold text-gray-900">{fmt(s.openingBalance)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Contributions</p>
                <p className="font-semibold text-emerald-600">+{fmt(s.contributions)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Withdrawals</p>
                <p className="font-semibold text-red-500">-{fmt(s.withdrawals)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Investment Gain / Loss</p>
                <p className={`font-semibold ${s.gainLoss >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {s.gainLoss >= 0 ? "+" : ""}{fmt(s.gainLoss)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Closing Balance</p>
                <p className="font-semibold text-gray-900">{fmt(s.closingBalance)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Period Return</p>
                <p className={`font-semibold ${pos ? "text-emerald-600" : "text-red-500"}`}>{pct(s.returnPercent)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100 sm:col-span-2">
                <p className="text-xs text-gray-400 mb-1">Statement Date</p>
                <p className="font-medium text-gray-700">{new Date(s.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function StatementsPage() {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/investor")
      .then((r) => r.json())
      .then((inv) => { setInvestor(inv); setLoading(false); });
  }, []);

  const statements = investor?.statements ?? [];

  // Running balance chart data
  const chartData = [...statements].reverse();
  const maxVal = Math.max(...chartData.map((s) => s.closingBalance));
  const minVal = Math.min(...chartData.map((s) => s.openingBalance));

  // Cumulative return
  const first = statements[statements.length - 1];
  const last = statements[0];
  const cumulativeReturn = first && last
    ? ((last.closingBalance - first.openingBalance) / first.openingBalance) * 100
    : 0;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Account Statements</h1>
        <p className="text-gray-500 text-sm mt-1">Quarterly performance and account activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400 text-sm">Loading statements…</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account Number</p>
              <p className="text-lg font-semibold text-gray-900">{investor?.accountNumber}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Current Value</p>
              <p className="text-lg font-semibold text-gray-900">{fmt(investor?.currentValue ?? 0)}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Cumulative Return</p>
              <p className={`text-lg font-semibold ${cumulativeReturn >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {pct(cumulativeReturn)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Statements</p>
              <p className="text-lg font-semibold text-gray-900">{statements.length} quarters</p>
            </div>
          </div>

          {/* Mini sparkline */}
          {chartData.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 text-sm mb-4">Account Value Over Time</h2>
              <div className="relative h-24">
                <svg viewBox={`0 0 ${chartData.length - 1} 100`} className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Fill */}
                  <path
                    d={`M 0 ${100 - ((chartData[0].closingBalance - minVal) / (maxVal - minVal)) * 90 - 5} ` +
                      chartData.slice(1).map((d, i) =>
                        `L ${i + 1} ${100 - ((d.closingBalance - minVal) / (maxVal - minVal)) * 90 - 5}`
                      ).join(" ") +
                      ` L ${chartData.length - 1} 100 L 0 100 Z`}
                    fill="url(#lineGrad)"
                  />
                  {/* Line */}
                  <polyline
                    points={chartData.map((d, i) =>
                      `${i},${100 - ((d.closingBalance - minVal) / (maxVal - minVal)) * 90 - 5}`
                    ).join(" ")}
                    fill="none"
                    stroke="#c9a84c"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Dots */}
                  {chartData.map((d, i) => (
                    <circle
                      key={i}
                      cx={i}
                      cy={100 - ((d.closingBalance - minVal) / (maxVal - minVal)) * 90 - 5}
                      r="2.5"
                      fill="#c9a84c"
                    />
                  ))}
                </svg>
              </div>
              <div className="flex justify-between mt-2">
                {chartData.map((d) => (
                  <span key={d.id} className="text-xs text-gray-400">{d.period}</span>
                ))}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 text-sm">Statement History</h2>
              <p className="text-xs text-gray-400 mt-0.5">Click any row to expand details</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Period", "Date", "Opening", "Closing", "Gain / Loss", "Return"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statements.map((s) => (
                  <StatementRow
                    key={s.id}
                    s={s}
                    expanded={expandedId === s.id}
                    onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  />
                ))}
              </tbody>
            </table>
            {statements.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-400 text-sm">
                No statements available yet.
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center">
            All figures in USD. Past performance is not indicative of future results.
            Contact your fund administrator with any questions.
          </p>
        </>
      )}
    </div>
  );
}
