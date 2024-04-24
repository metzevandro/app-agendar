import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "./data/account";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider !== "credentials" || !user) return true;
    
      const existingUser = await getUserById(user.id);
    
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
    
      return true;
    },     

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
    
      const existingUser = await getUserById(token.sub);
    
      if (!existingUser) return token;
    
      const existingAccount = await getAccountByUserId(existingUser.id);
    
      token.isOAuth = existingAccount ? true : false;
      token.name = existingUser.name;
      token.role = existingUser.role || 'default_role'; // Defina um valor padrão para a role
    
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
