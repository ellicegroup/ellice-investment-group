"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PortfolioSummary } from "@/lib/googleSheets";
import type { Investor } from "@/lib/investors";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && (
        <p className={`text-sm mt-1 font-medium ${positive === undefined ? "text-gray-500" : positive ? "text-emerald-600" : "text-red-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/investor").then((r) => r.json()),
    ]).then(([p, inv]) => {
      setPortfolio(p);
      setInvestor(inv);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading your account…</div>
      </div>
    );
  }

  const latestStatement = investor?.statements?.[0];
  const fundGain = portfolio ? portfolio.totalGainLoss >= 0 : true;
  const accountGain = investor ? investor.currentValue >= investor.investedCapital : true;

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {investor?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Account {investor?.accountNumber} · Last updated{" "}
          {(investor as (Investor & { portfolioLastUpdated?: string }))?.portfolioLastUpdated
            ? new Date((investor as (Investor & { portfolioLastUpdated?: string })).portfolioLastUpdated!).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
            : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Account stats */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Your Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Account Value"
            value={fmt(investor?.currentValue ?? 0)}
            sub={`${pct(((investor?.currentValue ?? 0) - (investor?.investedCapital ?? 1)) / (investor?.investedCapital ?? 1) * 100)} since inception`}
            positive={accountGain}
          />
          <StatCard
            label="Capital Invested"
            value={fmt(investor?.investedCapital ?? 0)}
          />
          <StatCard
            label="Total Return"
            value={fmt((investor?.currentValue ?? 0) - (investor?.investedCapital ?? 0))}
            sub={pct(((investor?.currentValue ?? 0) - (investor?.investedCapital ?? 1)) / (investor?.investedCapital ?? 1) * 100)}
            positive={accountGain}
          />
          <StatCard
            label="Fund Allocation"
            value={`${investor?.allocationPercent?.toFixed(1)}%`}
            sub="of total fund"
          />
        </div>
      </div>

      {/* Fund stats */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Fund Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Fund AUM"
            value={fmt(portfolio?.totalValue ?? 0)}
          />
          <StatCard
            label="Unrealized Gain / Loss"
            value={fmt(portfolio?.totalGainLoss ?? 0)}
            sub={pct(portfolio?.totalGainLossPercent ?? 0)}
            positive={fundGain}
          />
          <StatCard
            label="Number of Holdings"
            value={String(portfolio?.holdings?.length ?? 0)}
          />
        </div>
      </div>

      {/* Latest statement + top holdings side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest statement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">Latest Statement</h2>
            <Link href="/dashboard/statements" className="text-xs text-[#c9a84c] hover:underline font-medium">
              View all →
            </Link>
          </div>
          {latestStatement ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500">Period</span>
                <span className="text-sm font-medium text-gray-900">{latestStatement.period}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500">Opening Balance</span>
                <span className="text-sm text-gray-700">{fmt(latestStatement.openingBalance)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs text-gray-500">Closing Balance</span>
                <span className="text-sm font-semibold text-gray-900">{fmt(latestStatement.closingBalance)}</span>
              </div>
              {latestStatement.contributions > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-500">Contributions</span>
                  <span className="text-sm text-emerald-600">+{fmt(latestStatement.contributions)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-gray-500">Period Return</span>
                <span className={`text-sm font-semibold ${latestStatement.returnPercent >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {pct(latestStatement.returnPercent)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No statements available.</p>
          )}
        </div>

        {/* Top holdings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-sm">Top Holdings</h2>
            <Link href="/dashboard/portfolio" className="text-xs text-[#c9a84c] hover:underline font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {portfolio?.holdings?.slice(0, 5).map((h) => (
              <div key={h.ticker} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-gray-600">{h.ticker.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.ticker}</p>
                    <p className="text-xs text-gray-400">{h.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{h.weight.toFixed(1)}%</p>
                  <p className={`text-xs font-medium ${h.gainLossPercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {pct(h.gainLossPercent)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
