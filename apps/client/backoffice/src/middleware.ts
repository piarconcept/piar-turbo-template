import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const locales = ['es', 'ca', 'en'] as const;
const defaultLocale = 'ca';

const intlMiddleware = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL: API routes must bypass ALL middleware (including i18n)
  // NextAuth routes like /api/auth/* need direct access without locale prefix
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocale = locales.includes(maybeLocale as (typeof locales)[number]);
  const locale = hasLocale ? maybeLocale : defaultLocale;
  const pathnameWithoutLocale = hasLocale ? `/${segments.slice(1).join('/')}` || '/' : pathname;

  // Apply intl middleware for non-API routes
  const response = intlMiddleware(request);
  if (response.headers.has('location')) {
    return response;
  }

  // Check authentication for protected routes
  const session = await auth();

  if (!session?.user) {
    // Allow public routes without auth
    const publicPaths = ['/login', '/register', '/forgot-password', '/unauthorized'];
    const isPublicPath =
      pathnameWithoutLocale === '/' ||
      publicPaths.some((path) => pathnameWithoutLocale.startsWith(path));
    if (isPublicPath) {
      return response;
    }

    // No valid session or user - redirect to login
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set('callbackUrl', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  // Logged in users should not stay on public pages
  const publicPaths = ['/login', '/register', '/forgot-password', '/unauthorized'];
  const isPublicPath =
    pathnameWithoutLocale === '/' ||
    publicPaths.some((path) => pathnameWithoutLocale.startsWith(path));
  if (isPublicPath) {
    const isUnauthorizedPage = pathnameWithoutLocale.startsWith('/unauthorized');
    if (!isUnauthorizedPage) {
      const url = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(url);
    }
  }

  // User has valid session - check if trying to access dashboard without admin role
  const isDashboardRoute =
    pathnameWithoutLocale.startsWith('/dashboard') || pathnameWithoutLocale.startsWith('/home');

  if (isDashboardRoute && session.user.role !== 'admin') {
    // Has session but not admin - redirect to unauthorized
    const url = new URL(`/${locale}/unauthorized`, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
