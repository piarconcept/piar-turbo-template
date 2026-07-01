import type { AccountEntityProps } from '@piar/domain-models';
import type { AccountPublic } from './account.types';

export function toPublicAccount(account: AccountEntityProps): AccountPublic {
  const { passwordHash: _passwordHash, ...safeAccount } = account;
  return safeAccount;
}
