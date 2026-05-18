import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactSubmissionEntityProps, ContactSubmissionPort } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { ContactSubmissionFactory } from './factory';
import { ContactSubmissionOrmEntity } from './orm.entity';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';
import {
  applyAllowedFilters,
  applyAllowedSort,
  applyTextSearch,
  resolveListWindow,
} from '../common/dynamic-query';

@Injectable()
export class ContactSubmissionRepository implements ContactSubmissionPort {
  constructor(
    @InjectRepository(ContactSubmissionOrmEntity)
    private readonly contactRepository: Repository<ContactSubmissionOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntityProps>> {
    const { skip, limit } = resolveListWindow(query);
    const queryBuilder = this.contactRepository.createQueryBuilder('contactSubmission');

    applyTextSearch(
      queryBuilder,
      'contactSubmission',
      ['name', 'email', 'message', 'source'],
      query.searchQuery,
    );
    applyAllowedFilters(queryBuilder, 'contactSubmission', query.filters, {
      consent: 'consent',
      locale: 'locale',
      source: 'source',
      status: 'status',
    });
    applyAllowedSort(
      queryBuilder,
      'contactSubmission',
      query.sort,
      {
        createdAt: 'createdAt',
        email: 'email',
        name: 'name',
        source: 'source',
        status: 'status',
        updatedAt: 'updatedAt',
      },
      { key: 'createdAt', direction: 'DESC' },
    );

    const [rows, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      rows: ContactSubmissionFactory.toDomainList(rows),
      total,
    };
  }

  async getById(id: string): Promise<ContactSubmissionEntityProps | null> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    return contact ? ContactSubmissionFactory.toDomain(contact) : null;
  }

  async create(entity: ContactSubmissionEntityProps): Promise<ContactSubmissionEntityProps> {
    const data = ContactSubmissionFactory.fromDomain(entity);
    const created = await this.contactRepository.save(data);
    return ContactSubmissionFactory.toDomain(created);
  }

  async update(entity: ContactSubmissionEntityProps): Promise<ContactSubmissionEntityProps> {
    const data = ContactSubmissionFactory.fromDomain(entity);
    const updated = await this.contactRepository.save(data);
    return ContactSubmissionFactory.toDomain(updated);
  }

  async upsert(entity: ContactSubmissionEntityProps): Promise<ContactSubmissionEntityProps> {
    const data = ContactSubmissionFactory.fromDomain(entity);
    const upserted = await this.contactRepository.save(data);
    return ContactSubmissionFactory.toDomain(upserted);
  }

  async delete(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
