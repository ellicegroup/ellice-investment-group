"use client";
import { useEffect, useState } from "react";
import type { Investor } from "@/lib/investors";
import type { Document } from "@/lib/documents";
import Link from "next/link";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function AdminOverviewPage() {
  const [investors, setInvestors] = useState<Omit<Investor, "passwordHash">[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/investors").then((r) => r.json()),
      fetch("/api/admin/documents").then((r) => r.json()),
    ]).then(([inv, docs]) => {
      setInvestors(inv);
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const totalAUM = investors.reduce((s, i) => s + i.currentValue, 0);
  const totalInvested = investors.reduce((s, i) => s + i.investedCapital, 0);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Fund Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Manage investors, documents, and notifications</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total AUM", value: fmt(totalAUM) },
              { label: "Capital Invested", value: fmt(totalInvested) },
              { label: "Investors", value: String(investors.length) },
              { label: "Documents", value: String(documents.length) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link href="/admin/documents" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "#D4AF37" }}>
                <span className="text-lg">↑</span>
              </div>
              <p className="font-semibold text-gray-900 group-hover:text-[#2D5A43] transition">Upload Document</p>
              <p className="text-sm text-gray-500 mt-1">Push a document to all investors with optional email notification</p>
            </Link>
            <Link href="/admin/investors" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "#2D5A43" }}>
                <span className="text-lg text-white">◻</span>
              </div>
              <p className="font-semibold text-gray-900 group-hover:text-[#2D5A43] transition">View Investors</p>
              <p className="text-sm text-gray-500 mt-1">See all investor accounts, balances, and statement history</p>
            </Link>
          </div>

          {/* Investor table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">Active Investors</h2>
              <Link href="/admin/investors" className="text-xs text-gray-400 hover:text-gray-700 transition">View all →</Link>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Investor", "Account", "Invested", "Current Value", "Return", "Allocation"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investors.map((inv) => {
                  const ret = ((inv.currentValue - inv.investedCapital) / inv.investedCapital) * 100;
                  return (
                    <tr key={inv.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{inv.name}</p>
                        <p className="text-xs text-gray-400">{inv.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">{inv.accountNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{fmt(inv.investedCapital)}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{fmt(inv.currentValue)}</td>
                      <td className={`px-6 py-4 font-medium ${ret >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {ret >= 0 ? "+" : ""}{ret.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-gray-500">{inv.allocationPercent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Recent documents */}
          {documents.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 text-sm">Recent Documents</h2>
                <Link href="/admin/documents" className="text-xs text-gray-400 hover:text-gray-700 transition">Manage →</Link>
              </div>
              <ul className="divide-y divide-gray-100">
                {documents.slice(0, 5).map((doc) => (
                  <li key={doc.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doc.title}</p>
                      {doc.description && <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>}
                    </div>
                    <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
