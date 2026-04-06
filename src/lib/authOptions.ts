import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getInvestorByEmail } from "@/lib/investors";
import { verifyAdmin } from "@/lib/admin";
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

        // Check admin first
        const admin = await verifyAdmin(credentials.email, credentials.password);
        if (admin) {
          return { id: admin.id, name: admin.name, email: admin.email, isAdmin: true } as never;
        }

        // Check investor
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; isAdmin?: boolean }).id = token.id as string;
        (session.user as { id?: string; isAdmin?: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
};
