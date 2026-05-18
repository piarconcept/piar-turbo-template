import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicPageEntityProps, DynamicPagePort } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';
import {
  applyAllowedFilters,
  applyAllowedSort,
  applyTextSearch,
  resolveListWindow,
} from '../common/dynamic-query';
import { DynamicPageFactory } from './factory';
import { DynamicPageOrmEntity } from './orm.entity';

@Injectable()
export class DynamicPageRepository implements DynamicPagePort {
  constructor(
    @InjectRepository(DynamicPageOrmEntity)
    private readonly dynamicPageRepository: Repository<DynamicPageOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntityProps>> {
    const { skip, limit } = resolveListWindow(query);
    const queryBuilder = this.dynamicPageRepository.createQueryBuilder('dynamicPage');

    applyTextSearch(queryBuilder, 'dynamicPage', ['pageCode', 'slug', 'status'], query.searchQuery);
    applyAllowedFilters(queryBuilder, 'dynamicPage', query.filters, {
      isActive: 'isActive',
      showOnPublicWeb: 'showOnPublicWeb',
      status: 'status',
    });
    applyAllowedSort(
      queryBuilder,
      'dynamicPage',
      query.sort,
      {
        createdAt: 'createdAt',
        isActive: 'isActive',
        pageCode: 'pageCode',
        showOnPublicWeb: 'showOnPublicWeb',
        slug: 'slug',
        status: 'status',
        updatedAt: 'updatedAt',
        webPriority: 'webPriority',
      },
      { key: 'updatedAt', direction: 'DESC' },
    );

    const [rows, total] = await queryBuilder.skip(skip).take(limit).getManyAndCount();

    return {
      rows: DynamicPageFactory.toDomainList(rows),
      total,
    };
  }

  async getById(id: string): Promise<DynamicPageEntityProps | null> {
    const page = await this.dynamicPageRepository.findOne({ where: { id } });
    return page ? DynamicPageFactory.toDomain(page) : null;
  }

  async getByPageCode(pageCode: string): Promise<DynamicPageEntityProps | null> {
    const page = await this.dynamicPageRepository.findOne({ where: { pageCode } });
    return page ? DynamicPageFactory.toDomain(page) : null;
  }

  async getBySlug(slug: string): Promise<DynamicPageEntityProps | null> {
    const page = await this.dynamicPageRepository.findOne({ where: { slug } });
    return page ? DynamicPageFactory.toDomain(page) : null;
  }

  async create(entity: DynamicPageEntityProps): Promise<DynamicPageEntityProps> {
    const data = DynamicPageFactory.fromDomain(entity);
    const created = await this.dynamicPageRepository.save(this.dynamicPageRepository.create(data));
    return DynamicPageFactory.toDomain(created);
  }

  async update(entity: DynamicPageEntityProps): Promise<DynamicPageEntityProps> {
    const data = DynamicPageFactory.fromDomain(entity);
    const updated = await this.dynamicPageRepository.save(data);
    return DynamicPageFactory.toDomain(updated);
  }

  async upsert(entity: DynamicPageEntityProps): Promise<DynamicPageEntityProps> {
    const data = DynamicPageFactory.fromDomain(entity);
    const upserted = await this.dynamicPageRepository.save(data);
    return DynamicPageFactory.toDomain(upserted);
  }

  async delete(id: string): Promise<void> {
    await this.dynamicPageRepository.delete({ id });
  }
}
