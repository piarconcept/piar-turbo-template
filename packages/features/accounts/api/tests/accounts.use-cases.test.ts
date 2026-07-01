import { describe, expect, it, vi } from 'vitest';
import type { AccountEntityProps, AccountPort } from '@piar/domain-models';
import { BusinessRuleViolationError, ForbiddenError, NotFoundError } from '@piar/domain-models';
import {
  DeleteAccountUseCaseExecuter,
  GetAccountUseCaseExecuter,
  ListAccountsUseCaseExecuter,
  UpdateAccountUseCaseExecuter,
} from '../src/use-cases';

function createAccount(overrides: Partial<AccountEntityProps> = {}): AccountEntityProps {
  return {
    id: 'account-1',
    accountCode: 'PIAR_ADMIN',
    email: 'admin@piarconcept.com',
    passwordHash: 'hashed-password',
    role: 'admin',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    ...overrides,
  };
}

function createAccountPortMock() {
  return {
    list: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    getByAccountCode: vi.fn(),
    getByEmail: vi.fn(),
    comparePassword: vi.fn(),
    hasMultipleByRole: vi.fn(),
  };
}

describe('accounts use cases', () => {
  it('lists accounts with bounded query input and strips password hashes', async () => {
    const accountPort = createAccountPortMock();
    accountPort.list.mockResolvedValue({
      rows: [createAccount()],
      total: 1,
    });

    const useCase = new ListAccountsUseCaseExecuter(accountPort as unknown as AccountPort);
    const result = await useCase.execute({
      page: 2,
      limit: 25,
      searchQuery: ' admin ',
      sort: { key: 'updatedAt', direction: 'desc' },
      filters: { role: 'admin', ignored: 'value' },
    });

    expect(accountPort.list).toHaveBeenCalledWith({
      page: 2,
      limit: 25,
      searchQuery: 'admin',
      sort: { key: 'updatedAt', direction: 'desc' },
      filters: { role: 'admin' },
    });
    expect(result.total).toBe(1);
    expect(result.rows[0]).not.toHaveProperty('passwordHash');
  });

  it('throws NotFoundError when an account does not exist', async () => {
    const accountPort = createAccountPortMock();
    accountPort.getById.mockResolvedValue(null);

    const useCase = new GetAccountUseCaseExecuter(accountPort as unknown as AccountPort);

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('blocks self-demotion from admin role', async () => {
    const accountPort = createAccountPortMock();
    accountPort.getById.mockResolvedValue(createAccount());

    const useCase = new UpdateAccountUseCaseExecuter(accountPort as unknown as AccountPort);

    await expect(
      useCase.execute({
        id: 'account-1',
        currentAccountId: 'account-1',
        payload: { role: 'user' },
      }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(accountPort.update).not.toHaveBeenCalled();
  });

  it('updates account data after uniqueness checks pass', async () => {
    const existing = createAccount();
    const updated = createAccount({
      accountCode: 'PIAR_OWNER',
      email: 'owner@piarconcept.com',
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
    });
    const accountPort = createAccountPortMock();
    accountPort.getById.mockResolvedValue(existing);
    accountPort.getByAccountCode.mockResolvedValue(null);
    accountPort.getByEmail.mockResolvedValue(null);
    accountPort.update.mockResolvedValue(updated);

    const useCase = new UpdateAccountUseCaseExecuter(accountPort as unknown as AccountPort);
    const result = await useCase.execute({
      id: existing.id,
      currentAccountId: 'another-admin',
      payload: {
        accountCode: ' PIAR_OWNER ',
        email: ' owner@piarconcept.com ',
        role: 'admin',
      },
    });

    expect(accountPort.getByAccountCode).toHaveBeenCalledWith('PIAR_OWNER');
    expect(accountPort.getByEmail).toHaveBeenCalledWith('owner@piarconcept.com');
    expect(accountPort.update).toHaveBeenCalledWith(
      expect.objectContaining({
        accountCode: 'PIAR_OWNER',
        email: 'owner@piarconcept.com',
        role: 'admin',
      }),
    );
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('blocks deleting the last admin account', async () => {
    const accountPort = createAccountPortMock();
    accountPort.getById.mockResolvedValue(createAccount());
    accountPort.hasMultipleByRole.mockResolvedValue(false);

    const useCase = new DeleteAccountUseCaseExecuter(accountPort as unknown as AccountPort);

    await expect(
      useCase.execute({ id: 'account-1', currentAccountId: 'account-2' }),
    ).rejects.toBeInstanceOf(BusinessRuleViolationError);
    expect(accountPort.delete).not.toHaveBeenCalled();
  });
});
