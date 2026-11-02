import { describe, expect, it, vi } from 'vitest';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from '../src/guards/admin.guard';
import { JwtAuthGuard } from '../src/guards/jwt-auth.guard';
import { resolveAllowedOrigins } from '../src/origin/allowed-origins';
import type { JwtTokenService } from '../src/jwt/jwt-token.service';

function contextFor(request: Record<string, unknown>) {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as never;
}

describe('authorization guards', () => {
  it('rejects anonymous requests', async () => {
    const tokenService = { verify: vi.fn() } as unknown as JwtTokenService;

    await expect(
      new JwtAuthGuard(tokenService).canActivate(contextFor({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a regular user from an administrator route', () => {
    const guard = new AdminGuard();

    expect(() => guard.canActivate(contextFor({ user: { role: 'user' } }))).toThrow(
      ForbiddenException,
    );
  });

  it('allows an administrator after authentication', () => {
    const guard = new AdminGuard();

    expect(guard.canActivate(contextFor({ user: { role: 'admin' } }))).toBe(true);
  });
});

describe('CORS origin policy', () => {
  it('requires an explicit production origin', () => {
    expect(() => resolveAllowedOrigins(undefined, [], true)).toThrow('explicit CORS origin');
  });

  it('rejects wildcard and localhost production origins', () => {
    expect(() => resolveAllowedOrigins('https://*.example.com', [], true)).toThrow('wildcards');
    expect(() => resolveAllowedOrigins('http://localhost:3000', [], true)).toThrow(
      'not allowed in production',
    );
  });

  it('deduplicates exact origins', () => {
    expect(
      resolveAllowedOrigins('https://app.example.com,https://app.example.com/', [], true),
    ).toEqual(['https://app.example.com']);
  });
});
