import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactSubmissionEntityProps, ContactSubmissionPort } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { ContactSubmissionFactory } from './factory';
import { ContactSubmissionOrmEntity } from './orm.entity';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';

@Injectable()
export class ContactSubmissionRepository implements ContactSubmissionPort {
  constructor(
    @InjectRepository(ContactSubmissionOrmEntity)
    private readonly contactRepository: Repository<ContactSubmissionOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntityProps>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.contactRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      rows: ContactSubmissionFactory.toDomainList(rows),
      total,
    };
  }

  async getAll(): Promise<ContactSubmissionEntityProps[]> {
    const contacts = await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
    return ContactSubmissionFactory.toDomainList(contacts);
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
