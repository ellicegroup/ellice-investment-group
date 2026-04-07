"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

const SCENARIOS = [
  { label: "Ellice Growth Fund", rate: 0.184, color: "#2D5A43", textColor: "white", note: "Based on Fund I historical IRR" },
  { label: "S&P 500 Index", rate: 0.10, color: "#D4AF37", textColor: "#0a1628", note: "Historical average (1957–present)" },
  { label: "Term Deposit", rate: 0.045, color: "#e8e8e8", textColor: "#555", note: "NZ average term deposit rate" },
];

function fv(principal: number, annualRate: number, years: number, monthlyPMT: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r === 0) return principal + monthlyPMT * n;
  return principal * Math.pow(1 + r, n) + monthlyPMT * ((Math.pow(1 + r, n) - 1) / r);
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

function formatNum(n: number) {
  return new Intl.NumberFormat("en-NZ").format(Math.round(n));
}

const AMOUNT_STEPS = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
const YEAR_OPTIONS = [3, 5, 10, 15, 20, 25, 30];

const INVESTMENT_RANGES = [
  "Under $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000 – $1M",
  "$1M+",
];

export default function CalculatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [monthlyPMT, setMonthlyPMT] = useState(0);
  const [years, setYears] = useState(10);
  const [showBooking, setShowBooking] = useState(false);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", range: "", fund: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const results = useMemo(() =>
    SCENARIOS.map((s) => ({
      ...s,
      value: fv(principal, s.rate, years, monthlyPMT),
      totalContrib: principal + monthlyPMT * 12 * years,
    })),
    [principal, monthlyPMT, years]
  );

  const maxValue = Math.max(...results.map((r) => r.value));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, principal, monthlyPMT, years }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please email us directly.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const projectedValue = results[0].value;
  const totalContrib = principal + monthlyPMT * 12 * years;
  const gain = projectedValue - totalContrib;

  return (
    <div style={{ fontFamily: "Inter, -apple-system, sans-serif", color: "#1a1a1a", background: "#fff" }}>
      <PublicNav />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #0a1628 0%, #0d2236 55%, #0a1e14 100%)",
        padding: "72px 32px 88px",
        textAlign: "center",
        color: "white",
      }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 16 }}>
            Investment Calculator
          </p>
          <h1 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, margin: "0 0 18px", lineHeight: 1.2 }}>
            See What Your Money<br />Could Grow To
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 500, margin: "0 auto" }}>
            Compare projected returns across Ellice Growth Fund, the S&P 500,
            and a standard term deposit — then book a call to get started.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ padding: "64px 32px", background: "#f5f4f1" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 380px) 1fr", gap: 40, alignItems: "start" }}>

            {/* Inputs */}
            <div style={{ background: "white", borderRadius: 18, padding: 36, border: "1px solid #e8e8e8", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", margin: "0 0 28px" }}>Your Scenario</h2>

              {/* Initial Investment */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Initial Investment</label>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2D5A43" }}>${formatNum(principal)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={AMOUNT_STEPS.length - 1}
                  step={1}
                  value={AMOUNT_STEPS.indexOf(principal) === -1 ? 1 : AMOUNT_STEPS.indexOf(principal)}
                  onChange={(e) => setPrincipal(AMOUNT_STEPS[parseInt(e.target.value)])}
                  style={{ width: "100%", accentColor: "#2D5A43" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  <span>$5K</span><span>$1M</span>
                </div>
              </div>

              {/* Monthly Top-Up */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Monthly Top-Up</label>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2D5A43" }}>${formatNum(monthlyPMT)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={monthlyPMT}
                  onChange={(e) => setMonthlyPMT(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2D5A43" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 4 }}>
                  <span>$0 / mo</span><span>$5,000 / mo</span>
                </div>
              </div>

              {/* Time Period */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Investment Period</label>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#2D5A43" }}>{years} years</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {YEAR_OPTIONS.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYears(y)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        border: years === y ? "2px solid #2D5A43" : "2px solid #e8e8e8",
                        background: years === y ? "#2D5A43" : "white",
                        color: years === y ? "white" : "#555",
                        cursor: "pointer",
                      }}
                    >
                      {y}yr
                    </button>
                  ))}
                </div>
              </div>

              {/* Ellice Fund Projection Summary */}
              <div style={{ background: "#f0f7f3", borderRadius: 12, padding: "20px 20px", border: "1px solid #c8e0d4" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#2D5A43", margin: "0 0 10px" }}>
                  Ellice Fund Projection
                </p>
                <p style={{ fontSize: 32, fontWeight: 700, color: "#2D5A43", margin: "0 0 4px" }}>{fmt(projectedValue)}</p>
                <p style={{ fontSize: 12, color: "#555", margin: "0 0 10px" }}>
                  {fmt(gain)} gain on {fmt(totalContrib)} invested
                </p>
                <button
                  onClick={() => setShowBooking(true)}
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 14,
                    background: "linear-gradient(135deg, #c9a84c, #e8cd6a)",
                    color: "#0a1628",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Book a Free Call →
                </button>
              </div>
            </div>

            {/* Results */}
            <div>
              <div style={{ background: "white", borderRadius: 18, padding: 36, border: "1px solid #e8e8e8", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0a1628", margin: "0 0 8px" }}>
                  After {years} Years
                </h2>
                <p style={{ fontSize: 13, color: "#999", margin: "0 0 28px" }}>
                  Starting with {fmt(principal)}{monthlyPMT > 0 ? ` + ${fmt(monthlyPMT)}/mo` : ""}
                </p>

                {/* Bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {results.map(({ label, value, color, textColor, note, totalContrib: tc }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{label}</span>
                          <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{note}</span>
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{fmt(value)}</span>
                      </div>
                      {/* Progress bar — total */}
                      <div style={{ height: 36, background: "#f0f0f0", borderRadius: 8, overflow: "hidden", position: "relative" }}>
                        {/* Contribution portion */}
                        <div style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${Math.min(100, (tc / maxValue) * 100)}%`,
                          background: color === "#e8e8e8" ? "#ccc" : `${color}40`,
                          borderRadius: 8,
                        }} />
                        {/* Total bar */}
                        <div style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${(value / maxValue) * 100}%`,
                          background: color,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 12,
                          transition: "width 0.5s ease",
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: textColor, whiteSpace: "nowrap" }}>
                            +{fmt(value - tc)} gain
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 11, color: "#bbb", margin: "24px 0 0", lineHeight: 1.6 }}>
                  Projections use compound interest with monthly compounding. Past performance is not indicative of future results.
                  The Ellice fund rate is based on Fund I historical IRR and is not guaranteed.
                </p>
              </div>

              {/* Quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Total You Invest", value: fmt(totalContrib) },
                  { label: "Projected Gain", value: fmt(gain), green: true },
                  { label: "Multiplier", value: `${(projectedValue / totalContrib).toFixed(1)}×`, green: true },
                ].map(({ label, value, green }) => (
                  <div key={label} style={{ background: "white", borderRadius: 12, padding: "18px 16px", border: "1px solid #e8e8e8", textAlign: "center" }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: green ? "#2D5A43" : "#1a1a1a", margin: "0 0 4px" }}>{value}</p>
                    <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking modal / inline form */}
      {showBooking && (
        <section style={{ padding: "64px 32px", background: "white", borderTop: "2px solid #f0f0f0" }}>
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0a1628", margin: "0 0 12px" }}>Request Received!</h2>
                <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, marginBottom: 24 }}>
                  Thank you — Easter Tekafa will be in touch within 1–2 business days to schedule your call.
                </p>
                <button
                  onClick={() => { setShowBooking(false); setSubmitted(false); setForm({ name: "", email: "", phone: "", range: "", fund: "", message: "" }); }}
                  style={{ fontSize: 14, fontWeight: 600, color: "#2D5A43", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Run another scenario
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 36 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2.5, color: "#D4AF37", marginBottom: 12 }}>
                    Get Started
                  </p>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0a1628", margin: "0 0 12px" }}>
                    Book a Free Discovery Call
                  </h2>
                  <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7 }}>
                    Interested in investing with Ellice? Fill in your details and our Managing Director Easter Tekafa
                    will reach out to discuss your goals and how we can help.
                  </p>
                  {/* Snapshot of their projection */}
                  <div style={{ background: "#f0f7f3", borderRadius: 12, padding: "16px 20px", marginTop: 20, border: "1px solid #c8e0d4" }}>
                    <p style={{ fontSize: 13, color: "#555", margin: 0 }}>
                      Your projection: <strong style={{ color: "#2D5A43" }}>{fmt(principal)}</strong> over{" "}
                      <strong style={{ color: "#2D5A43" }}>{years} years</strong> →{" "}
                      <strong style={{ color: "#2D5A43" }}>{fmt(projectedValue)}</strong>
                      {monthlyPMT > 0 ? ` (+ ${fmt(monthlyPMT)}/mo)` : ""}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Email Address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Phone (optional)</label>
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+64 21 000 000"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Investment Range</label>
                      <select
                        value={form.range}
                        onChange={(e) => setForm((f) => ({ ...f, range: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, background: "white", boxSizing: "border-box", outline: "none" }}
                      >
                        <option value="">Select range…</option>
                        {INVESTMENT_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 8 }}>Fund Interest</label>
                    <div style={{ display: "flex", gap: 10 }}>
                      {["Ellice Growth Fund I", "Ellice Growth Fund II", "Both Funds"].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, fund: f }))}
                          style={{
                            padding: "8px 14px",
                            borderRadius: 8,
                            fontSize: 13,
                            fontWeight: 600,
                            border: form.fund === f ? "2px solid #2D5A43" : "2px solid #e8e8e8",
                            background: form.fund === f ? "#2D5A43" : "white",
                            color: form.fund === f ? "white" : "#555",
                            cursor: "pointer",
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#333", display: "block", marginBottom: 6 }}>Message (optional)</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us about your investment goals…"
                      rows={3}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, boxSizing: "border-box", resize: "vertical", outline: "none" }}
                    />
                  </div>

                  {error && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 16 }}>{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: "100%",
                      padding: "14px 0",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 15,
                      background: submitting ? "#ccc" : "linear-gradient(135deg, #c9a84c, #e8cd6a)",
                      color: "#0a1628",
                      border: "none",
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? "Sending…" : "Request My Discovery Call →"}
                  </button>
                  <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 12 }}>
                    No spam. Your details are only shared with Easter Tekafa.
                  </p>
                </form>
              </>
            )}
          </div>
        </section>
      )}

      {/* CTA if booking not shown */}
      {!showBooking && (
        <section style={{ background: "linear-gradient(135deg, #2D5A43, #1a3828)", padding: "64px 32px", textAlign: "center", color: "white" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px" }}>Ready to Start Investing?</h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 28 }}>
              Book a free discovery call with Easter Tekafa to discuss your investment goals and how Ellice can help you grow your wealth.
            </p>
            <button
              onClick={() => setShowBooking(true)}
              style={{
                padding: "13px 36px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                background: "linear-gradient(135deg, #c9a84c, #e8cd6a)",
                color: "#0a1628",
                border: "none",
                cursor: "pointer",
              }}
            >
              Book a Free Call →
            </button>
          </div>
        </section>
      )}

      <PublicFooter />
    </div>
  );
}
