import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const BACKOFFICE_BFF_URL = process.env.BACKOFFICE_BFF_URL || 'http://localhost:5050';

type BackendLoginResponse = {
  account: { id: string; email?: string; role?: string };
  token: string;
};

async function loginWithFetch(email: string, password: string): Promise<BackendLoginResponse> {
  const res = await fetch(`${BACKOFFICE_BFF_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      JSON.stringify({
        i18n: 'login_failed',
        message: text || 'Login failed',
        statusCode: res.status,
      }),
    );
  }

  return JSON.parse(text) as BackendLoginResponse;
}

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
          const email = credentials.email as string;
          const password = credentials.password as string;

          const { account, token } = await loginWithFetch(email, password);

          return {
            id: account.id,
            email: account.email ?? email,
            name: account.email ?? email,
            role: account.role ?? 'user',
            accessToken: token,
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
