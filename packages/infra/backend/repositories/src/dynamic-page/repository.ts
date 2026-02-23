import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DynamicPageEntityProps, DynamicPagePort } from '@piar/domain-models';
import { Repository } from 'typeorm';
import { DynamicQuery, type PaginatedResult } from '@piar/domain-dynamic-form';
import { DynamicPageFactory } from './factory';
import { DynamicPageOrmEntity } from './orm.entity';

@Injectable()
export class DynamicPageRepository implements DynamicPagePort {
  constructor(
    @InjectRepository(DynamicPageOrmEntity)
    private readonly dynamicPageRepository: Repository<DynamicPageOrmEntity>,
  ) {}

  async list(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntityProps>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [rows, total] = await this.dynamicPageRepository.findAndCount({
      skip,
      take: limit,
    });

    return {
      rows: DynamicPageFactory.toDomainList(rows),
      total,
    };
  }

  async getAll(): Promise<DynamicPageEntityProps[]> {
    const pages = await this.dynamicPageRepository.find();
    return DynamicPageFactory.toDomainList(pages);
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
