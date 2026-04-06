"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b2e45 50%, #0d1b2a 100%)" }}>
      {/* Top bar */}
      <div className="border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)" }}>
            <span className="text-[#0d1b2a] font-bold text-sm">E</span>
          </div>
          <span className="text-white font-semibold tracking-wide text-sm uppercase">Ellice Investment Group</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Card header */}
            <div className="px-8 pt-10 pb-8 text-center" style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)" }}>
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)" }}>
                <span className="text-[#0d1b2a] font-bold text-2xl">E</span>
              </div>
              <h1 className="text-white text-2xl font-semibold tracking-tight">Investor Portal</h1>
              <p className="text-white/60 text-sm mt-1">Ellice Investment Group</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <p className="text-gray-500 text-sm text-center mb-6">Sign in to access your account</p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                    style={{ focusRingColor: "#c9a84c" } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-sm text-[#0d1b2a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)" }}
                >
                  {loading ? "Signing in…" : "Sign In to Portal"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Having trouble? Contact{" "}
                  <a href="mailto:support@elliceinvestmentgroup.com" className="underline hover:text-gray-600">
                    support@elliceinvestmentgroup.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <p className="text-white/30 text-xs text-center mt-6">
            © {new Date().getFullYear()} Ellice Investment Group. All rights reserved.
            <br />This portal is for authorized investors only.
          </p>
        </div>
      </div>
    </div>
  );
}
