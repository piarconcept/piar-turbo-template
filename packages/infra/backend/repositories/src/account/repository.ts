import { Injectable } from '@nestjs/common';
import { AccountPort, AccountEntityProps } from '@piar/domain-models';
import { mockAccounts, AccountMockData } from './schema';
import { AccountFactory } from './factory';
import * as bcrypt from 'bcryptjs';

/**
 * Account Repository Implementation
 * Implements AccountPort interface from domain
 * Uses in-memory MockData for now, can be replaced with real database
 */
@Injectable()
export class AccountRepository implements AccountPort {
  private accounts: AccountMockData[] = [...mockAccounts];

  /**
   * Get all accounts
   */
  async getAll(): Promise<AccountEntityProps[]> {
    return AccountFactory.toDomainList(this.accounts);
  }

  /**
   * Get account by ID
   */
  async getById(id: string): Promise<AccountEntityProps | null> {
    const account = this.accounts.find((acc) => acc.id === id);
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Get account by account code
   */
  async getByAccountCode(accountCode: string): Promise<AccountEntityProps | null> {
    const account = this.accounts.find((acc) => acc.accountCode === accountCode);
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Get account by email
   */
  async getByEmail(email: string): Promise<AccountEntityProps | null> {
    const account = this.accounts.find((acc) => acc.email === email);
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Compare password with stored hash
   */
  async comparePassword(email: string, password: string): Promise<boolean> {
    const account = this.accounts.find((acc) => acc.email === email);
    if (!account || !account.passwordHash) {
      return false;
    }
    return bcrypt.compare(password, account.passwordHash);
  }

  /**
   * Create new account
   */
  async create(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const newAccount = AccountFactory.fromDomain(entity);
    this.accounts.push(newAccount);
    return AccountFactory.toDomain(newAccount);
  }

  /**
   * Update existing account
   */
  async update(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const index = this.accounts.findIndex((acc) => acc.id === entity.id);
    if (index === -1) {
      throw new Error(`Account with id ${entity.id} not found`);
    }

    const updated = {
      ...AccountFactory.fromDomain(entity),
      updatedAt: new Date().toISOString(),
    };
    this.accounts[index] = updated;
    return AccountFactory.toDomain(updated);
  }

  /**
   * Upsert (update or create)
   */
  async upsert(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const existing = await this.getById(entity.id);
    if (existing) {
      return this.update(entity);
    }
    return this.create(entity);
  }

  /**
   * Delete account by ID
   */
  async delete(id: string): Promise<void> {
    const index = this.accounts.findIndex((acc) => acc.id === id);
    if (index === -1) {
      throw new Error(`Account with id ${id} not found`);
    }
    this.accounts.splice(index, 1);
  }
}
