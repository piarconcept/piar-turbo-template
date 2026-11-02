import { describe, expect, it, vi } from 'vitest';
import type { AccountPort } from '@piar/domain-models';
import type { JwtTokenService } from '@piar/infra-backend-common-security';
import { AuthRepository } from '../src/repositories/auth.repository';

function createAccountPortMock() {
  return {
    getByEmail: vi.fn(),
    getById: vi.fn(),
    update: vi.fn(),
    hasMultipleByRole: vi.fn(),
  };
}

describe('AuthRepository', () => {
  it.each([null, { id: 'account-1' }])(
    'returns the same forgot-password response regardless of account existence',
    async (account) => {
      const accountPort = createAccountPortMock();
      accountPort.getByEmail.mockResolvedValue(account);
      const repository = new AuthRepository(
        accountPort as unknown as AccountPort,
        {} as JwtTokenService,
      );

      await expect(repository.forgotPassword({ email: 'person@example.com' })).resolves.toEqual({
        success: true,
        message: 'If an account exists, password reset instructions will be sent.',
      });
    },
  );

  it('rejects role changes without a server-derived actor', async () => {
    const accountPort = createAccountPortMock();
    const repository = new AuthRepository(
      accountPort as unknown as AccountPort,
      {} as JwtTokenService,
    );

    await expect(repository.updateUserRole({ userId: 'account-1', role: 'user' })).rejects.toThrow(
      'Authenticated administrator context is required',
    );
    expect(accountPort.getById).not.toHaveBeenCalled();
  });

  it('blocks administrator self-demotion', async () => {
    const accountPort = createAccountPortMock();
    accountPort.getById.mockResolvedValue({ id: 'admin-1', role: 'admin' });
    const repository = new AuthRepository(
      accountPort as unknown as AccountPort,
      {} as JwtTokenService,
    );

    await expect(
      repository.updateUserRole({
        userId: 'admin-1',
        role: 'user',
        actorAccountId: 'admin-1',
      }),
    ).rejects.toThrow('Administrators cannot demote their own account');
    expect(accountPort.update).not.toHaveBeenCalled();
  });
});
