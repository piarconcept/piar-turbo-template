import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { HttpAuthRepository } from '@piar/auth-infra-client';

const authRepository = new HttpAuthRepository(
  process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL || "http://localhost:5050"
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Use repository instead of direct fetch
          const { account, session } = await authRepository.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          return {
            id: account.id,
            email: account.email ?? '',
            name: account.email ?? 'User', // Use email as name since AccountEntity doesn't have name
            role: account.role ?? 'user',
            accessToken: session.token,
          };
        } catch (error) {
          // Error is already structured by repository
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});
