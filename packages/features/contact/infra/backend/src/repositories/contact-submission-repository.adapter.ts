import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type {
  CreateContactSubmissionPayload,
  IContactSubmissionRepository,
  UpdateContactSubmissionPayload,
} from '@piar/contact-configuration';
import {
  ContactSubmissionEntity,
  ContactSubmissionEntityProps,
  ContactSubmissionPort,
  NotFoundError,
} from '@piar/domain-models';
import { randomUUID } from 'crypto';

export class ContactSubmissionRepositoryAdapter implements IContactSubmissionRepository {
  constructor(private readonly contactSubmissionPort: ContactSubmissionPort) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntity>> {
    const result = await this.contactSubmissionPort.list(query);

    return {
      rows: result.rows.map((record) => new ContactSubmissionEntity(record)),
      total: result.total,
    };
  }

  async getById(id: string): Promise<ContactSubmissionEntity | null> {
    const record = await this.contactSubmissionPort.getById(id);
    return record ? new ContactSubmissionEntity(record) : null;
  }

  async create(payload: CreateContactSubmissionPayload): Promise<ContactSubmissionEntity> {
    const entity: ContactSubmissionEntityProps = {
      id: randomUUID(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const created = await this.contactSubmissionPort.create(entity);
    return new ContactSubmissionEntity(created);
  }

  async update(payload: UpdateContactSubmissionPayload): Promise<ContactSubmissionEntity> {
    const existing = await this.contactSubmissionPort.getById(payload.id);
    if (!existing) {
      throw new NotFoundError('ContactSubmission', payload.id, 'contact_submission_not_found');
    }
    const entity: ContactSubmissionEntityProps = {
      ...existing,
      ...payload,
      updatedAt: new Date(),
    };
    const updated = await this.contactSubmissionPort.update(entity);
    return new ContactSubmissionEntity(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.contactSubmissionPort.getById(id);
    if (!existing) {
      throw new NotFoundError('ContactSubmission', id, 'contact_submission_not_found');
    }
    await this.contactSubmissionPort.delete(id);
  }
}
