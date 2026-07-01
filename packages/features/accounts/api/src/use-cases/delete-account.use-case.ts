import { Inject, Injectable } from '@nestjs/common';
import {
  AccountPort as AccountPortToken,
  type AccountPort,
  BusinessRuleViolationError,
  ForbiddenError,
  NotFoundError,
} from '@piar/domain-models';

export interface DeleteAccountUseCaseInput {
  id: string;
  currentAccountId?: string;
}

export interface DeleteAccountUseCase {
  execute(input: DeleteAccountUseCaseInput): Promise<void>;
}

export const DeleteAccountUseCase = Symbol('DeleteAccountUseCase');

@Injectable()
export class DeleteAccountUseCaseExecuter implements DeleteAccountUseCase {
  constructor(
    @Inject(AccountPortToken)
    private readonly accountPort: AccountPort,
  ) {}

  async execute({ id, currentAccountId }: DeleteAccountUseCaseInput): Promise<void> {
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
      const hasAnotherAdmin = await this.accountPort.hasMultipleByRole('admin');
      if (!hasAnotherAdmin) {
        throw new BusinessRuleViolationError(
          'last_admin',
          'At least one admin account is required',
          'account_last_admin_required',
        );
      }
    }

    await this.accountPort.delete(id);
  }
}
