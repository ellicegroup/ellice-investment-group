"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Investor, Statement } from "@/lib/investors";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

export default function PrintStatementPage() {
  const params = useSearchParams();
  const statementId = params.get("id");
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [statement, setStatement] = useState<Statement | null>(null);

  useEffect(() => {
    fetch("/api/investor")
      .then((r) => r.json())
      .then((inv: Investor) => {
        setInvestor(inv);
        const s = inv.statements.find((s) => s.id === statementId) ?? inv.statements[0];
        setStatement(s ?? null);
      });
  }, [statementId]);

  useEffect(() => {
    if (investor && statement) {
      setTimeout(() => window.print(), 400);
    }
  }, [investor, statement]);

  if (!investor || !statement) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", padding: 40, color: "#888" }}>
        Loading statement…
      </div>
    );
  }

  const pos = statement.returnPercent >= 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Montserrat:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: white; color: #1a1a1a; }
        .no-print { display: block; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ background: "#f8f7f4", padding: "12px 40px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={() => window.print()}
          style={{ background: "#534AB7", color: "white", border: "none", padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          ⎙ Save / Print PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{ background: "none", border: "1px solid #ccc", padding: "8px 20px", borderRadius: 6, fontSize: 13, cursor: "pointer", color: "#555" }}
        >
          Close
        </button>
      </div>

      {/* Letterhead */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 40px 60px", borderTop: "8px solid #534AB7" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Ellice Investment Group" style={{ height: 52, width: "auto" }} />
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>Account Statement</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>{statement.period}</p>
            <p style={{ fontSize: 12, color: "#555" }}>{new Date(statement.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>

        {/* Investor info */}
        <div style={{ background: "#f8f7f4", borderRadius: 10, padding: "20px 24px", marginBottom: 36 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 40px" }}>
            {[
              ["Investor Name", investor.name],
              ["Account Number", investor.accountNumber],
              ["Email Address", investor.email],
              ["Fund Allocation", `${investor.allocationPercent}%`],
            ].map(([label, value]) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{label}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section heading */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "#534AB7", marginBottom: 16 }}>
          Account Activity — {statement.period}
        </p>

        {/* Activity table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, marginBottom: 8 }}>
          <tbody>
            {[
              ["Opening Balance", fmt(statement.openingBalance), false],
              ["Contributions", `+${fmt(statement.contributions)}`, false],
              ["Withdrawals", `-${fmt(statement.withdrawals)}`, false],
              ["Investment Gain / Loss", `${statement.gainLoss >= 0 ? "+" : ""}${fmt(statement.gainLoss)}`, false],
            ].map(([label, value]) => (
              <tr key={label as string} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "13px 0", color: "#555" }}>{label}</td>
                <td style={{ padding: "13px 0", textAlign: "right", fontWeight: 500, color: "#1a1a1a" }}>{value}</td>
              </tr>
            ))}
            <tr style={{ borderTop: "2px solid #534AB7", background: "#f8f7f4" }}>
              <td style={{ padding: "14px 12px", fontWeight: 700, color: "#1a1a1a" }}>Closing Balance</td>
              <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{fmt(statement.closingBalance)}</td>
            </tr>
            <tr style={{ borderTop: "1px solid #eee" }}>
              <td style={{ padding: "13px 0", color: "#555" }}>Period Return</td>
              <td style={{ padding: "13px 0", textAlign: "right", fontWeight: 700, color: pos ? "#059669" : "#dc2626" }}>{pct(statement.returnPercent)}</td>
            </tr>
          </tbody>
        </table>

        {/* Disclaimer */}
        <p style={{ fontSize: 11, color: "#aaa", marginTop: 32, borderTop: "1px solid #eee", paddingTop: 16 }}>
          All figures in USD. This statement is for informational purposes only.
          Past performance is not indicative of future results.
        </p>

        {/* Footer */}
        <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888" }}>
          <div>
            <p style={{ fontWeight: 600, color: "#534AB7" }}>Ellice Investment Group</p>
            <p>support@elliceinvestmentgroup.com</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <p>Confidential — For authorized recipients only</p>
          </div>
        </div>
      </div>
    </>
  );
}
