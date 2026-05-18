import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountPort, AccountEntityProps, BusinessRuleViolationError } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { AccountFactory } from './factory';
import * as bcrypt from 'bcryptjs';
import { AccountOrmEntity } from './orm.entity';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';
import {
  applyAllowedFilters,
  applyAllowedSort,
  applyTextSearch,
  resolveListWindow,
} from '../common/dynamic-query';

@Injectable()
export class AccountRepository implements AccountPort {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepository: Repository<AccountOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<AccountEntityProps>> {
    const { skip, limit } = resolveListWindow(query);
    const queryBuilder = this.accountRepository.createQueryBuilder('account');

    applyTextSearch(queryBuilder, 'account', ['accountCode', 'email', 'role'], query.searchQuery);
    applyAllowedFilters(queryBuilder, 'account', query.filters, {
      role: 'role',
    });
    applyAllowedSort(
      queryBuilder,
      'account',
      query.sort,
      {
        accountCode: 'accountCode',
        email: 'email',
        role: 'role',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      },
      { key: 'updatedAt', direction: 'DESC' },
    );

    const [rows, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      rows: AccountFactory.toDomainList(rows),
      total,
    };
  }

  /**
   * Get account by ID
   */
  async getById(id: string): Promise<AccountEntityProps | null> {
    const account = await this.accountRepository.findOne({ where: { id } });
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Get account by account code
   */
  async getByAccountCode(accountCode: string): Promise<AccountEntityProps | null> {
    const account = await this.accountRepository.findOne({ where: { accountCode } });
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Get account by email
   */
  async getByEmail(email: string): Promise<AccountEntityProps | null> {
    const account = await this.accountRepository.findOne({ where: { email } });
    return account ? AccountFactory.toDomain(account) : null;
  }

  /**
   * Compare password with stored hash
   */
  async comparePassword(email: string, password: string): Promise<boolean> {
    const account = await this.accountRepository.findOne({ where: { email } });
    if (!account?.passwordHash) {
      return false;
    }
    return bcrypt.compare(password, account.passwordHash);
  }

  async hasMultipleByRole(role: NonNullable<AccountEntityProps['role']>): Promise<boolean> {
    const rows = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.id')
      .where('account.role = :role', { role })
      .take(2)
      .getRawMany();

    return rows.length > 1;
  }

  /**
   * Create new account
   */
  async create(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const hasExistingAccount = await this.hasAnyAccount();
    const role: 'admin' | 'user' = hasExistingAccount ? 'user' : 'admin';
    const passwordHash = entity.passwordHash
      ? await bcrypt.hash(entity.passwordHash, 10)
      : undefined;
    const data = AccountFactory.fromDomain({ ...entity, role, passwordHash });
    const created = await this.accountRepository.save(
      this.accountRepository.create({
        ...data,
        id: undefined,
      }),
    );
    return AccountFactory.toDomain(created);
  }

  /**
   * Update existing account
   */
  async update(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const existing = await this.accountRepository.findOne({ where: { id: entity.id } });
    const nextRole = entity.role ?? existing?.role;
    if (existing?.role === 'admin' && nextRole !== 'admin') {
      await this.ensureAtLeastOneAdminRemains();
    }

    const data = AccountFactory.fromDomain(entity);
    const updated = await this.accountRepository.save(data);
    return AccountFactory.toDomain(updated);
  }

  /**
   * Upsert (update or create)
   */
  async upsert(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const existing = entity.id
      ? await this.accountRepository.findOne({ where: { id: entity.id } })
      : null;
    const hasExistingAccount = existing ? true : await this.hasAnyAccount();
    const existingRole: AccountEntityProps['role'] =
      existing?.role === 'admin' || existing?.role === 'user' ? existing.role : undefined;
    const role: AccountEntityProps['role'] = hasExistingAccount
      ? (entity.role ?? existingRole)
      : 'admin';

    if (existing?.role === 'admin' && role !== 'admin') {
      await this.ensureAtLeastOneAdminRemains();
    }

    const data = AccountFactory.fromDomain({ ...entity, role });
    const upserted = await this.accountRepository.save(data);
    return AccountFactory.toDomain(upserted);
  }

  /**
   * Delete account by ID
   */
  async delete(id: string): Promise<void> {
    const existing = await this.accountRepository.findOne({ where: { id } });
    if (existing?.role === 'admin') {
      await this.ensureAtLeastOneAdminRemains();
    }

    await this.accountRepository.delete({ id });
  }

  private async ensureAtLeastOneAdminRemains(): Promise<void> {
    const hasAnotherAdmin = await this.hasMultipleByRole('admin');
    if (!hasAnotherAdmin) {
      throw new BusinessRuleViolationError(
        'last_admin',
        'At least one admin account is required',
        'account_last_admin_required',
      );
    }
  }

  private async hasAnyAccount(): Promise<boolean> {
    const row = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.id')
      .take(1)
      .getRawOne();

    return Boolean(row);
  }
}
