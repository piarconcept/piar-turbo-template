import type { DeepPartial } from 'typeorm';
import type { ContactSubmissionEntityProps, ContactSubmissionStatus } from '@piar/domain-models';
import type { ContactSubmissionOrmEntity } from './orm.entity';

export type ContactSubmissionRecord = DeepPartial<ContactSubmissionOrmEntity>;

export class ContactSubmissionFactory {
  static toDomain(data: ContactSubmissionRecord): ContactSubmissionEntityProps {
    return {
      id: data.id ?? '',
      name: data.name ?? '',
      email: data.email ?? '',
      message: data.message ?? '',
      consent: data.consent ?? false,
      lastPages: (data.lastPages as string[] | null) ?? undefined,
      locale: data.locale ?? undefined,
      source: data.source ?? undefined,
      status: (data.status as ContactSubmissionStatus | null) ?? undefined,
      metadata: (data.metadata as Record<string, string> | null) ?? undefined,
      createdAt: (data.createdAt as Date | undefined) ?? new Date(),
      updatedAt: (data.updatedAt as Date | undefined) ?? new Date(),
    };
  }

  static fromDomain(entity: ContactSubmissionEntityProps): ContactSubmissionRecord {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      message: entity.message,
      consent: entity.consent ?? false,
      lastPages: entity.lastPages ?? null,
      locale: entity.locale ?? null,
      source: entity.source ?? null,
      status: entity.status ?? 'new',
      metadata: (entity.metadata as Record<string, string> | null) ?? null,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }

  static toDomainList(dataList: ContactSubmissionRecord[]): ContactSubmissionEntityProps[] {
    return dataList.map((data) => ContactSubmissionFactory.toDomain(data));
  }
}
