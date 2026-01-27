import { BasePort } from '../base/base.port';
import { AccountEntityProps } from './account.entity';

export interface AccountPort extends BasePort<AccountEntityProps> {
  getByAccountCode(accountCode: string): Promise<AccountEntityProps | null>;
  getByEmail(email: string): Promise<AccountEntityProps | null>;
  comparePassword(email: string, password: string): Promise<boolean>;
}

export const AccountPort = Symbol('AccountPort');
