import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { HttpAuthRepository } from '@piar/auth-infra-client';

const authRepository = new HttpAuthRepository(
  process.env.NEXT_PUBLIC_BACKOFFICE_BFF_URL || 'http://localhost:5050',
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        try {
          // Use repository instead of direct fetch
          const { account, session } = await authRepository.login({
            email: credentials.email as string,
            password: credentials.password as string,
            rememberMe:
              credentials.rememberMe === true ||
              credentials.rememberMe === 'true' ||
              credentials.rememberMe === 'on',
          });

          return {
            id: account.id,
            email: account.email ?? '',
            name: account.email ?? 'User', // Use email as name since AccountEntity doesn't have name
            role: account.role ?? 'user',
            accessToken: session.token,
            refreshToken: session.refreshToken,
            refreshExpiresAt: session.refreshExpiresAt,
            expiresAt: session.expiresAt,
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
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        const refreshExpiresAt = (user as { refreshExpiresAt?: string }).refreshExpiresAt;
        token.refreshExpiresAt = refreshExpiresAt
          ? new Date(refreshExpiresAt).getTime()
          : undefined;
        const sessionExpiresAt = (user as { expiresAt?: string }).expiresAt;
        token.expiresAt = sessionExpiresAt ? new Date(sessionExpiresAt).getTime() : undefined;
      }

      // Refresh session when backend token expires
      if (typeof token.expiresAt === 'number' && Date.now() >= token.expiresAt) {
        const refreshToken = token.refreshToken as string | undefined;
        if (!refreshToken) return null;

        try {
          const session = await authRepository.refresh({ refreshToken });
          token.accessToken = session.token;
          token.expiresAt = new Date(session.expiresAt).getTime();
          token.refreshToken = session.refreshToken ?? refreshToken;
          token.refreshExpiresAt = session.refreshExpiresAt
            ? new Date(session.refreshExpiresAt).getTime()
            : token.refreshExpiresAt;
        } catch {
          return null;
        }
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});
