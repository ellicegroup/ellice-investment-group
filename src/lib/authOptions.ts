import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getInvestorByEmail } from "@/lib/investors";
import { verifyAdmin } from "@/lib/admin";
import { fastapiLogin } from "@/lib/fastapiClient";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // ── Admin check (always local) ──────────────────────────────────────
        const admin = await verifyAdmin(credentials.email, credentials.password);
        if (admin) {
          return { id: admin.id, name: admin.name, email: admin.email, isAdmin: true } as never;
        }

        // ── FastAPI backend (when INVESTOR_API_URL is configured) ───────────
        if (process.env.INVESTOR_API_URL) {
          const result = await fastapiLogin(credentials.email, credentials.password);
          if (result?.access_token) {
            return {
              id: result.investor_id ?? result.email,
              name: result.name,
              email: result.email ?? credentials.email,
              apiToken: result.access_token,
              isAdmin: result.is_admin ?? false,
            } as never;
          }
          // API is configured but login failed — don't fall through to hardcoded
          return null;
        }

        // ── Hardcoded fallback (no INVESTOR_API_URL set) ────────────────────
        const investor = getInvestorByEmail(credentials.email);
        if (!investor) return null;
        const valid = await bcrypt.compare(credentials.password, investor.passwordHash);
        if (!valid) return null;
        return { id: investor.id, name: investor.name, email: investor.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false;
        // Store FastAPI JWT so data routes can use it
        const apiToken = (user as { apiToken?: string }).apiToken;
        if (apiToken) token.apiToken = apiToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const u = session.user as { id?: string; isAdmin?: boolean; apiToken?: string };
        u.id = token.id as string;
        u.isAdmin = token.isAdmin as boolean;
        if (token.apiToken) u.apiToken = token.apiToken as string;
      }
      return session;
    },
  },
};
