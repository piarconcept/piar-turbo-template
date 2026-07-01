import { Inject, Injectable } from '@nestjs/common';
import {
  AccountPort as AccountPortToken,
  type AccountPort,
  NotFoundError,
} from '@piar/domain-models';
import { toPublicAccount } from './account-presenter';
import type { AccountPublic } from './account.types';

export interface GetAccountUseCase {
  execute(id: string): Promise<AccountPublic>;
}

export const GetAccountUseCase = Symbol('GetAccountUseCase');

@Injectable()
export class GetAccountUseCaseExecuter implements GetAccountUseCase {
  constructor(
    @Inject(AccountPortToken)
    private readonly accountPort: AccountPort,
  ) {}

  async execute(id: string): Promise<AccountPublic> {
    const existing = await this.accountPort.getById(id);
    if (!existing) {
      throw new NotFoundError('Account', id, 'account_not_found');
    }
    return toPublicAccount(existing);
  }
}
