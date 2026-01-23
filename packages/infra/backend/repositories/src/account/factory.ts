import { AccountEntityProps } from '@piar/domain-models';
import { AccountMockData } from './schema';

/**
 * Account Factory
 * Converts raw data (MockData, Prisma, TypeORM, etc.) into domain entities
 */
export class AccountFactory {
  /**
   * Convert raw data to domain entity props
   */
  static toDomain(data: AccountMockData): AccountEntityProps {
    return {
      id: data.id,
      accountCode: data.accountCode,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  /**
   * Convert domain entity props to raw data
   * Used when creating or updating records
   */
  static fromDomain(entity: AccountEntityProps): AccountMockData {
    return {
      id: entity.id,
      accountCode: entity.accountCode,
      email: entity.email,
      passwordHash: entity.passwordHash,
      role: entity.role,
      createdAt: entity.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: entity.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  /**
   * Convert multiple raw data items to domain entities
   */
  static toDomainList(dataList: AccountMockData[]): AccountEntityProps[] {
    return dataList.map((data) => AccountFactory.toDomain(data));
  }
}
