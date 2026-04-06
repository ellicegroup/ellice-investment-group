"use client";
import { useEffect, useState } from "react";
import type { Investor } from "@/lib/investors";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function AdminInvestorsPage() {
  const [investors, setInvestors] = useState<Omit<Investor, "passwordHash">[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/investors")
      .then((r) => r.json())
      .then((data) => { setInvestors(data); setLoading(false); });
  }, []);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Investors</h1>
        <p className="text-gray-500 text-sm mt-1">{investors.length} active accounts</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <div className="space-y-4">
          {investors.map((inv) => {
            const ret = ((inv.currentValue - inv.investedCapital) / inv.investedCapital) * 100;
            const isExpanded = expanded === inv.id;
            const latest = inv.statements[0];
            return (
              <div key={inv.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition text-left"
                  onClick={() => setExpanded(isExpanded ? null : inv.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: "#2D5A43" }}>
                      {inv.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{inv.name}</p>
                      <p className="text-xs text-gray-400">{inv.email} · {inv.accountNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="text-xs text-gray-400">Value</p>
                      <p className="font-semibold text-gray-900">{fmt(inv.currentValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Return</p>
                      <p className={`font-semibold ${ret >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {ret >= 0 ? "+" : ""}{ret.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Allocation</p>
                      <p className="font-semibold text-gray-700">{inv.allocationPercent}%</p>
                    </div>
                    <span className="text-gray-300 text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        ["Capital Invested", fmt(inv.investedCapital)],
                        ["Current Value", fmt(inv.currentValue)],
                        ["Gain / Loss", fmt(inv.currentValue - inv.investedCapital)],
                        ["Fund Allocation", `${inv.allocationPercent}%`],
                        ["Join Date", new Date(inv.joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })],
                        ["Statements", `${inv.statements.length} quarters`],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-xs text-gray-400 mb-1">{label}</p>
                          <p className="font-semibold text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>

                    {inv.statements.length > 0 && (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Statement History</p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100">
                              {["Period", "Opening", "Closing", "Return"].map((h) => (
                                <th key={h} className="pb-2 text-left text-xs font-semibold text-gray-400">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {inv.statements.map((s) => (
                              <tr key={s.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-2.5 text-gray-700">{s.period}</td>
                                <td className="py-2.5 text-gray-500">{fmt(s.openingBalance)}</td>
                                <td className="py-2.5 font-medium text-gray-900">{fmt(s.closingBalance)}</td>
                                <td className={`py-2.5 font-medium ${s.returnPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                                  {s.returnPercent >= 0 ? "+" : ""}{s.returnPercent.toFixed(2)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
