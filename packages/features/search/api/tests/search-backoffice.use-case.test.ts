import { describe, expect, it, vi } from 'vitest';
import { Logger } from '@nestjs/common';
import type { AccountEntityProps, AccountPort } from '@piar/domain-models';
import { SearchBackofficeUseCaseExecuter } from '../src/use-cases';

function createAccount(overrides: Partial<AccountEntityProps> = {}): AccountEntityProps {
  return {
    id: 'account-1',
    accountCode: 'PIAR_ADMIN',
    email: 'admin@piarconcept.com',
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

describe('SearchBackofficeUseCase', () => {
  it('returns an empty response and does not query accounts for blank input', async () => {
    const accountPort = createAccountPortMock();
    const useCase = new SearchBackofficeUseCaseExecuter(accountPort as unknown as AccountPort);

    const result = await useCase.execute({ query: '   ' });

    expect(result).toEqual({ query: '', total: 0, collections: [] });
    expect(accountPort.list).not.toHaveBeenCalled();
  });

  it('searches accounts with a bounded limit and maps results', async () => {
    const accountPort = createAccountPortMock();
    accountPort.list.mockResolvedValue({
      rows: [createAccount()],
      total: 12,
    });
    const useCase = new SearchBackofficeUseCaseExecuter(accountPort as unknown as AccountPort);

    const result = await useCase.execute({
      query: ' admin ',
      limitPerCollection: 500,
    });

    expect(accountPort.list).toHaveBeenCalledWith({
      page: 1,
      limit: 50,
      searchQuery: 'admin',
      sort: {
        key: 'updatedAt',
        direction: 'desc',
      },
    });
    expect(result).toEqual({
      query: 'admin',
      total: 12,
      collections: [
        {
          key: 'accounts',
          total: 12,
          items: [
            {
              id: 'account-1',
              title: 'PIAR_ADMIN',
              subtitle: 'admin@piarconcept.com',
              description: 'admin',
              path: '/accounts/account-1',
              updatedAt: '2026-01-02T00:00:00.000Z',
            },
          ],
        },
      ],
    });
  });

  it('returns an empty accounts collection when account search fails', async () => {
    const loggerSpy = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
    const accountPort = createAccountPortMock();
    accountPort.list.mockRejectedValue(new Error('database unavailable'));
    const useCase = new SearchBackofficeUseCaseExecuter(accountPort as unknown as AccountPort);

    const result = await useCase.execute({ query: 'admin' });

    expect(result).toEqual({ query: 'admin', total: 0, collections: [] });
    expect(loggerSpy).toHaveBeenCalledWith(
      'Search failed for accounts collection',
      expect.any(Error),
    );
    loggerSpy.mockRestore();
  });
});
