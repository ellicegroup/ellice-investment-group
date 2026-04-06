"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Overview", icon: "◈" },
  { href: "/admin/investors", label: "Investors", icon: "◻" },
  { href: "/admin/documents", label: "Documents", icon: "≡" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && !isAdmin) router.replace("/dashboard");
  }, [status, isAdmin, router]);

  if (status === "loading" || !session || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1b2a" }}>
        <div className="text-white/40 text-sm">Verifying access…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f0f0ec" }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Ellice Investment Group" className="h-10 w-auto brightness-0 invert" />
        </div>

        {/* Admin badge */}
        <div className="px-6 py-3 border-b border-white/10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#D4AF37", color: "#1a1a1a" }}>
            ⬡ Admin Portal
          </span>
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
                  active ? "text-[#1a1a1a]" : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                style={active ? { background: "#D4AF37" } : {}}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-5 border-t border-white/10">
          <p className="text-white text-xs font-medium truncate mb-0.5">{session.user?.name}</p>
          <p className="text-white/40 text-xs truncate mb-3">{session.user?.email}</p>
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
