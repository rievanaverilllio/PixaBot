import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { verifyPassword } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

type AppToken = JWT & { id?: string; role?: string | null };

const toTitleCase = (s?: string | null) => {
  if (!s) return s ?? undefined;
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
};

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const isValid = await verifyPassword(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        } as unknown as { id: string; name?: string | null; email?: string | null; role?: string | null };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const t = token as AppToken;
        const u = user as unknown as { id?: string; role?: string | null };
        t.id = u.id ? String(u.id) : undefined;
        t.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const t = token as AppToken;
        const sessionUser = session.user as typeof session.user & { id?: string; role?: string | null };
        sessionUser.id = t.id;
        sessionUser.role = t.role;
        // normalize display name to Title Case for UI
        if (sessionUser?.name) sessionUser.name = toTitleCase(sessionUser.name) as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
