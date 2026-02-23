import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    refreshExpiresAt?: string;
    expiresAt?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    refreshExpiresAt?: number;
    expiresAt?: number;
  }
}
