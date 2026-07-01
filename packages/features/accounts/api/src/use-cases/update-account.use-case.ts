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
import type { UpdateAccountDto } from '../dto/update-account.dto';
import { toPublicAccount } from './account-presenter';
import type { AccountPublic, AccountRole } from './account.types';

const ALLOWED_ROLES: AccountRole[] = ['admin', 'user'];

export interface UpdateAccountUseCaseInput {
  id: string;
  payload: UpdateAccountDto;
  currentAccountId?: string;
}

export interface UpdateAccountUseCase {
  execute(input: UpdateAccountUseCaseInput): Promise<AccountPublic>;
}

export const UpdateAccountUseCase = Symbol('UpdateAccountUseCase');

@Injectable()
export class UpdateAccountUseCaseExecuter implements UpdateAccountUseCase {
  constructor(
    @Inject(AccountPortToken)
    private readonly accountPort: AccountPort,
  ) {}

  async execute({
    id,
    payload,
    currentAccountId,
  }: UpdateAccountUseCaseInput): Promise<AccountPublic> {
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

    return toPublicAccount(updated);
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
