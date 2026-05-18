import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type {
  CreateDynamicPagePayload,
  IDynamicPageRepository,
  UpdateDynamicPagePayload,
} from '@piar/dynamic-page-configuration';
import {
  DynamicPageEntity,
  DynamicPageEntityProps,
  DynamicPagePort,
  NotFoundError,
} from '@piar/domain-models';
import { randomUUID } from 'crypto';

export class DynamicPageRepositoryAdapter implements IDynamicPageRepository {
  constructor(private readonly dynamicPagePort: DynamicPagePort) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntity>> {
    const result = await this.dynamicPagePort.list(query);

    return {
      rows: result.rows.map((record) => new DynamicPageEntity(record)),
      total: result.total,
    };
  }

  async getById(id: string): Promise<DynamicPageEntity | null> {
    const record = await this.dynamicPagePort.getById(id);
    return record ? new DynamicPageEntity(record) : null;
  }

  async getByPageCode(pageCode: string): Promise<DynamicPageEntity | null> {
    const record = await this.dynamicPagePort.getByPageCode(pageCode);
    return record ? new DynamicPageEntity(record) : null;
  }

  async getBySlug(slug: string): Promise<DynamicPageEntity | null> {
    const record = await this.dynamicPagePort.getBySlug(slug);
    return record ? new DynamicPageEntity(record) : null;
  }

  async create(payload: CreateDynamicPagePayload): Promise<DynamicPageEntity> {
    const entity: DynamicPageEntityProps = {
      id: randomUUID(),
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const created = await this.dynamicPagePort.create(entity);
    return new DynamicPageEntity(created);
  }

  async update(payload: UpdateDynamicPagePayload): Promise<DynamicPageEntity> {
    const existing = await this.dynamicPagePort.getById(payload.id);
    if (!existing) {
      throw new NotFoundError('DynamicPage', payload.id, 'dynamic_page_not_found');
    }
    const entity: DynamicPageEntityProps = {
      ...existing,
      ...payload,
      updatedAt: new Date(),
    };
    const updated = await this.dynamicPagePort.update(entity);
    return new DynamicPageEntity(updated);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.dynamicPagePort.getById(id);
    if (!existing) {
      throw new NotFoundError('DynamicPage', id, 'dynamic_page_not_found');
    }
    await this.dynamicPagePort.delete(id);
  }
}
