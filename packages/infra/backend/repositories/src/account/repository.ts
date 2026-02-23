import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountPort, AccountEntityProps, BusinessRuleViolationError } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { AccountFactory } from './factory';
import * as bcrypt from 'bcryptjs';
import { AccountOrmEntity } from './orm.entity';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';

/**
 * Account Repository Implementation
 * Implements AccountPort interface from domain
 * Uses in-memory MockData for now, can be replaced with real database
 */
@Injectable()
export class AccountRepository implements AccountPort {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepository: Repository<AccountOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<AccountEntityProps>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.accountRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      rows: AccountFactory.toDomainList(rows),
      total,
    };
  }
  /**
   * Get all accounts
   */
  async getAll(): Promise<AccountEntityProps[]> {
    const accounts = await this.accountRepository.find();
    return AccountFactory.toDomainList(accounts);
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

  /**
   * Create new account
   */
  async create(entity: AccountEntityProps): Promise<AccountEntityProps> {
    const accountCount = await this.accountRepository.count();
    const role: 'admin' | 'user' = accountCount === 0 ? 'admin' : 'user';
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
    const accountCount = existing ? undefined : await this.accountRepository.count();
    const existingRole: AccountEntityProps['role'] =
      existing?.role === 'admin' || existing?.role === 'user' ? existing.role : undefined;
    const role: AccountEntityProps['role'] =
      accountCount === 0 ? 'admin' : (entity.role ?? existingRole);

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
    const adminCount = await this.accountRepository.count({ where: { role: 'admin' } });
    if (adminCount <= 1) {
      throw new BusinessRuleViolationError(
        'last_admin',
        'At least one admin account is required',
        'account_last_admin_required',
      );
    }
  }
}
