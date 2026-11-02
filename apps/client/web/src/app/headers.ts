function apiOrigin(): string | undefined {
  const value = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!value) return undefined;

  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('NEXT_PUBLIC_API_URL must use HTTP or HTTPS.');
  }
  return url.origin;
}

export function buildContentSecurityPolicy(): string {
  const scripts = ["'self'", "'unsafe-inline'"];
  if (process.env.NODE_ENV !== 'production') scripts.push("'unsafe-eval'");

  const connections = ["'self'", apiOrigin()].filter(Boolean).join(' ');
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "img-src 'self' data: https:",
    `script-src ${scripts.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src ${connections}`,
  ].join('; ');
}

export default async function headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-DNS-Prefetch-Control', value: 'off' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
        },
        {
          key: 'Content-Security-Policy',
          value: buildContentSecurityPolicy(),
        },
      ],
    },
  ];
}
