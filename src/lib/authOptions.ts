import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getInvestorByEmail } from "@/lib/investors";
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
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
