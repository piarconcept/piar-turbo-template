import { GUARDS_METADATA } from '@nestjs/common/constants';
import { describe, expect, it } from 'vitest';
import { AdminGuard, JwtAuthGuard } from '@piar/infra-backend-common-security';
import { AuthController } from '../src/controllers/auth.controller';
import { resolveJwtSecret } from '../src/security/resolve-jwt-secret';

describe('authentication security boundaries', () => {
  it('requires authentication and administrator authorization to change roles', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      AuthController.prototype.updateUserRole,
    ) as unknown[];

    expect(guards).toEqual([JwtAuthGuard, AdminGuard]);
  });

  it('rejects a missing JWT secret', () => {
    expect(() => resolveJwtSecret({})).toThrow('JWT_SECRET is required');
  });

  it('rejects weak JWT secrets', () => {
    expect(() => resolveJwtSecret({ JWT_SECRET: 'change-me' })).toThrow(
      'JWT_SECRET must contain at least 32 characters',
    );
  });

  it('accepts a sufficiently long secret without changing it', () => {
    const secret = 'test-only-secret-with-at-least-32-characters';

    expect(resolveJwtSecret({ JWT_SECRET: secret })).toBe(secret);
  });
});
