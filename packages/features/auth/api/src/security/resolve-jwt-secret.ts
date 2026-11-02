const MINIMUM_JWT_SECRET_LENGTH = 32;

const REJECTED_JWT_SECRETS = new Set([
  'change-me',
  'changeme',
  'secret',
  'your-secret-key-here-replace-this-in-production',
]);

export function resolveJwtSecret(environment: NodeJS.ProcessEnv = process.env): string {
  const secret = environment.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is required before the authentication module can start.');
  }

  if (secret.length < MINIMUM_JWT_SECRET_LENGTH || REJECTED_JWT_SECRETS.has(secret.toLowerCase())) {
    throw new Error(`JWT_SECRET must contain at least ${MINIMUM_JWT_SECRET_LENGTH} characters.`);
  }

  return secret;
}
