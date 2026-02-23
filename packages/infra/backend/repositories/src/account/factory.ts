import { AccountEntityProps } from '@piar/domain-models';
import type { DeepPartial } from 'typeorm';
import type { AccountOrmEntity } from './orm.entity';

export type AccountRecord = DeepPartial<AccountOrmEntity>;

/**
 * Account Factory
 * Converts raw data (MockData, Prisma, TypeORM, etc.) into domain entities
 */
export class AccountFactory {
  private static toDate(value: unknown): Date | undefined {
    if (!value) {
      return undefined;
    }
    if (value instanceof Date) {
      return value;
    }
    const date = new Date(value as string);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * Convert raw data to domain entity props
   */
  static toDomain(data: AccountRecord): AccountEntityProps {
    return {
      id: data.id ?? '',
      accountCode: data.accountCode ?? '',
      email: data.email ?? undefined,
      passwordHash: data.passwordHash ?? undefined,
      role: (data.role as AccountEntityProps['role']) ?? undefined,
      createdAt: AccountFactory.toDate(data.createdAt) ?? new Date(),
      updatedAt: AccountFactory.toDate(data.updatedAt) ?? new Date(),
    };
  }

  /**
   * Convert domain entity props to raw data
   * Used when creating or updating records
   */
  static fromDomain(entity: AccountEntityProps): AccountRecord {
    return {
      id: entity.id,
      accountCode: entity.accountCode,
      email: entity.email ?? undefined,
      passwordHash: entity.passwordHash ?? undefined,
      role: entity.role ?? undefined,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }

  /**
   * Convert multiple raw data items to domain entities
   */
  static toDomainList(dataList: AccountRecord[]): AccountEntityProps[] {
    return dataList.map((data) => AccountFactory.toDomain(data));
  }
}
