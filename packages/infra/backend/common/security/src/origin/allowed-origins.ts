const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

function normalizeOrigin(value: string, production: boolean): string {
  if (value.includes('*')) {
    throw new Error('CORS origins must be exact and cannot contain wildcards.');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid CORS origin: ${value}`);
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error(`CORS origin must be an HTTP(S) origin without credentials: ${value}`);
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`CORS origin cannot include a path, query, or fragment: ${value}`);
  }

  if (production && LOCAL_HOSTNAMES.has(url.hostname)) {
    throw new Error(`Local CORS origin is not allowed in production: ${value}`);
  }

  return url.origin;
}

export function resolveAllowedOrigins(
  configuredOrigins: string | undefined,
  localDefaults: string[],
  production = process.env.NODE_ENV === 'production',
): string[] {
  const configured = (configuredOrigins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (production && configured.length === 0) {
    throw new Error('At least one explicit CORS origin is required in production.');
  }

  const candidates = production ? configured : [...configured, ...localDefaults];
  return [...new Set(candidates.map((origin) => normalizeOrigin(origin, production)))];
}
