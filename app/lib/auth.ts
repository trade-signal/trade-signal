import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/db";
import { hashPassword } from "@/shared/encrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true, // 允许危险邮件账户链接
      httpOptions: {
        timeout: 1000 * 10 * 10 // 100 seconds
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true, // 允许危险邮件账户链接
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      httpOptions: {
        timeout: 1000 * 10 * 10 // 100 seconds
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        if (!user.password) return null;
        if (user.password !== hashPassword(credentials.password)) return null;

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || "secret"
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  debug: process.env.NODE_ENV === "development"
};
