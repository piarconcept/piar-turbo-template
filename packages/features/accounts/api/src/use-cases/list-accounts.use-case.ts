import { Inject, Injectable } from '@nestjs/common';
import {
  AccountPort as AccountPortToken,
  type AccountPort,
  type AccountEntityProps,
} from '@piar/domain-models';
import { toPublicAccount } from './account-presenter';
import type { AccountListQuery, AccountRole, PaginatedAccounts } from './account.types';

const ALLOWED_ROLES: AccountRole[] = ['admin', 'user'];

export interface ListAccountsUseCase {
  execute(query: AccountListQuery): Promise<PaginatedAccounts>;
}

export const ListAccountsUseCase = Symbol('ListAccountsUseCase');

@Injectable()
export class ListAccountsUseCaseExecuter implements ListAccountsUseCase {
  constructor(
    @Inject(AccountPortToken)
    private readonly accountPort: AccountPort,
  ) {}

  async execute(query: AccountListQuery): Promise<PaginatedAccounts> {
    const roleFilter = this.getRoleFilter(query.filters);
    const result = await this.accountPort.list({
      page: query.page,
      limit: query.limit,
      searchQuery: query.searchQuery?.trim() || undefined,
      sort: query.sort,
      filters: roleFilter ? { role: roleFilter } : undefined,
    });

    return {
      rows: result.rows.map((account: AccountEntityProps) => toPublicAccount(account)),
      total: result.total,
    };
  }

  private getRoleFilter(filters?: Record<string, unknown>): AccountRole | undefined {
    if (!filters) return undefined;
    const rawRole = filters.role;
    if (typeof rawRole !== 'string') return undefined;
    if ((ALLOWED_ROLES as string[]).includes(rawRole)) {
      return rawRole as AccountRole;
    }
    return undefined;
  }
}
