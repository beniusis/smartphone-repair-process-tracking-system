import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email_address: credentials.email,
          },
        });

        if (
          credentials.email === user.email_address &&
          bcrypt.compareSync(credentials.password, user.password)
        ) {
          return {
            id: user.id,
            name: user.name,
            surname: user.surname,
            role: user.role,
          };
        } else {
          throw new Error("Neteisingi prisijungimo duomenys!");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.surname = user.surname;
        token.role = user.role;
      }

      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user_id = token.id;
        session.user_name = token.name;
        session.user_surname = token.surname;
        session.user_role = token.role;
      }

      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
