"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "▦" },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: "◈" },
  { href: "/dashboard/statements", label: "Statements", icon: "≡" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1b2a" }}>
        <div className="text-white/40 text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f8f7f4" }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #0d1b2a 0%, #1b3a5c 100%)" }}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <img src="/logo.svg" alt="Ellice Investment Group" className="h-10 w-auto brightness-0 invert" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "text-[#0d1b2a]"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                style={active ? { background: "linear-gradient(135deg, #c9a84c, #f0d080)" } : {}}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-white/70 text-sm font-semibold">
                {session.user?.name?.[0] ?? "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{session.user?.name}</p>
              <p className="text-white/40 text-xs truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left text-xs text-white/40 hover:text-white/70 transition px-1"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
