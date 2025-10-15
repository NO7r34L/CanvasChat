import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db/db";
import * as authSchema from "./db/auth-schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: authSchema.users,
    accountsTable: authSchema.accounts,
    sessionsTable: authSchema.sessions,
    verificationTokensTable: authSchema.verificationTokens,
    authenticatorsTable: authSchema.authenticators,
  }),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Simple email-only auth for demo
        // In production, you'd verify password here
        const existingUser = await db
          .select()
          .from(authSchema.users)
          .where(eq(authSchema.users.email, credentials.email as string))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            id: existingUser[0].id,
            email: existingUser[0].email!,
            name: existingUser[0].name,
            image: existingUser[0].image,
          };
        }

        // Create new user
        const newUser = await db
          .insert(authSchema.users)
          .values({
            email: credentials.email as string,
            name: (credentials.email as string).split("@")[0],
          })
          .returning();

        return {
          id: newUser[0].id,
          email: newUser[0].email!,
          name: newUser[0].name,
          image: newUser[0].image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
});

