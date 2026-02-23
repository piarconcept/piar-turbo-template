import { Inject, Injectable } from '@nestjs/common';
import {
  AccountPort as AccountPortToken,
  type AccountPort,
  type AccountEntityProps,
  BusinessRuleViolationError,
  ForbiddenError,
  NotFoundError,
  ResourceAlreadyExistsError,
} from '@piar/domain-models';
import type { UpdateAccountDto } from './dto/update-account.dto';

type AccountRole = NonNullable<AccountEntityProps['role']>;
type SortDirection = 'asc' | 'desc';

interface AccountSort {
  key: string;
  direction: SortDirection;
}

interface AccountListQuery {
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: AccountSort;
  filters?: Record<string, unknown>;
}

export type AccountPublic = Omit<AccountEntityProps, 'passwordHash'>;

export interface PaginatedAccounts {
  rows: AccountPublic[];
  total: number;
}

const ALLOWED_ROLES: AccountRole[] = ['admin', 'user'];
const SORTABLE_KEYS = new Set<keyof AccountPublic>([
  'accountCode',
  'email',
  'role',
  'createdAt',
  'updatedAt',
]);

@Injectable()
export class AccountsService {
  constructor(
    @Inject(AccountPortToken)
    private readonly accountPort: AccountPort,
  ) {}

  async list(query: AccountListQuery): Promise<PaginatedAccounts> {
    const allAccounts = await this.accountPort.getAll();

    const normalizedSearch = query.searchQuery?.trim().toLowerCase();
    const roleFilter = this.getRoleFilter(query.filters);

    const filtered = allAccounts
      .filter((account) => (roleFilter ? account.role === roleFilter : true))
      .filter((account) => {
        if (!normalizedSearch) return true;
        const searchableValues = [account.accountCode, account.email, account.role]
          .filter((value): value is string => typeof value === 'string')
          .map((value) => value.toLowerCase());

        return searchableValues.some((value) => value.includes(normalizedSearch));
      })
      .map((account) => this.toPublicAccount(account));

    const sorted = this.sortAccounts(filtered, query.sort);
    const page = Number.isFinite(query.page) && query.page > 0 ? Math.floor(query.page) : 1;
    const limit =
      Number.isFinite(query.limit) && query.limit > 0 ? Math.min(Math.floor(query.limit), 100) : 10;

    const start = (page - 1) * limit;
    const rows = sorted.slice(start, start + limit);

    return {
      rows,
      total: sorted.length,
    };
  }

  async getById(id: string): Promise<AccountPublic> {
    const existing = await this.accountPort.getById(id);
    if (!existing) {
      throw new NotFoundError('Account', id, 'account_not_found');
    }
    return this.toPublicAccount(existing);
  }

  async update(
    id: string,
    payload: UpdateAccountDto,
    currentAccountId?: string,
  ): Promise<AccountPublic> {
    const existing = await this.accountPort.getById(id);
    if (!existing) {
      throw new NotFoundError('Account', id, 'account_not_found');
    }

    const nextRole = this.resolveRole(payload.role, existing.role);
    if (id === currentAccountId && nextRole !== 'admin') {
      throw new ForbiddenError(
        'You cannot remove your own admin role',
        { id },
        'account_cannot_demote_self',
      );
    }

    const nextAccountCode = this.resolveAccountCode(payload.accountCode, existing.accountCode);
    const nextEmail = this.resolveEmail(payload.email, existing.email);

    if (nextAccountCode !== existing.accountCode) {
      const accountByCode = await this.accountPort.getByAccountCode(nextAccountCode);
      if (accountByCode && accountByCode.id !== id) {
        throw new ResourceAlreadyExistsError(
          'Account code',
          nextAccountCode,
          'account_code_exists',
        );
      }
    }

    if (nextEmail && nextEmail !== existing.email) {
      const accountByEmail = await this.accountPort.getByEmail(nextEmail);
      if (accountByEmail && accountByEmail.id !== id) {
        throw new ResourceAlreadyExistsError('Account email', nextEmail, 'account_email_exists');
      }
    }

    const updated = await this.accountPort.update({
      ...existing,
      accountCode: nextAccountCode,
      email: nextEmail,
      role: nextRole,
      updatedAt: new Date(),
    });

    return this.toPublicAccount(updated);
  }

  async delete(id: string, currentAccountId?: string): Promise<void> {
    if (id === currentAccountId) {
      throw new ForbiddenError(
        'You cannot delete your own account',
        { id },
        'account_cannot_delete_self',
      );
    }

    const existing = await this.accountPort.getById(id);
    if (!existing) {
      throw new NotFoundError('Account', id, 'account_not_found');
    }

    if (existing.role === 'admin') {
      const accounts = await this.accountPort.getAll();
      const adminCount = accounts.filter((account) => account.role === 'admin').length;
      if (adminCount <= 1) {
        throw new BusinessRuleViolationError(
          'last_admin',
          'At least one admin account is required',
          'account_last_admin_required',
        );
      }
    }

    await this.accountPort.delete(id);
  }

  private toPublicAccount(account: AccountEntityProps): AccountPublic {
    // Keep API responses safe by never exposing password hashes.
    const { passwordHash: _passwordHash, ...safeAccount } = account;
    return safeAccount;
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

  private sortAccounts(accounts: AccountPublic[], sort?: AccountSort): AccountPublic[] {
    if (!sort || !SORTABLE_KEYS.has(sort.key as keyof AccountPublic)) {
      return accounts;
    }

    const direction = sort.direction === 'desc' ? -1 : 1;
    const key = sort.key as keyof AccountPublic;

    return [...accounts].sort((left, right) => {
      const leftValue = this.toComparableValue(left[key]);
      const rightValue = this.toComparableValue(right[key]);

      if (leftValue === rightValue) return 0;
      return leftValue > rightValue ? direction : -direction;
    });
  }

  private toComparableValue(value: unknown): number | string {
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return value.toLowerCase();
    if (typeof value === 'boolean') return value ? 1 : 0;
    return '';
  }

  private resolveRole(
    nextRole: UpdateAccountDto['role'],
    currentRole: AccountEntityProps['role'],
  ): AccountRole {
    const role = nextRole ?? currentRole ?? 'user';
    if (!ALLOWED_ROLES.includes(role)) {
      throw new BusinessRuleViolationError(
        'invalid_role',
        'Role must be admin or user',
        'account_invalid_role',
      );
    }
    return role;
  }

  private resolveAccountCode(
    nextCode: UpdateAccountDto['accountCode'],
    currentCode: string,
  ): string {
    if (nextCode === undefined) return currentCode;
    const normalized = nextCode.trim();
    if (!normalized) {
      throw new BusinessRuleViolationError(
        'invalid_account_code',
        'Account code is required',
        'account_code_required',
      );
    }
    return normalized;
  }

  private resolveEmail(
    nextEmail: UpdateAccountDto['email'],
    currentEmail: string | undefined,
  ): string | undefined {
    if (nextEmail === undefined) return currentEmail;
    const normalized = nextEmail?.trim();
    return normalized ? normalized : undefined;
  }
}
