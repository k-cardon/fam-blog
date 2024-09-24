import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DefaultSession, NextAuthOptions } from "next-auth";

// Parse the authorized emails from the environment variable
const authorizedUsers = process.env.AUTHORIZED_EMAILS?.split(',') || [];

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_API_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Check if user is defined and has an email
      if (user?.email && authorizedUsers.includes(user.email)) {
        return true; // Allow sign-in
      }
      return false; // Deny sign-in
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


