import type { DeepPartial } from 'typeorm';
import type {
  DynamicPageEntityProps,
  DynamicPageHero,
  DynamicPageSection,
  DynamicPageSeo,
  DynamicPageStatus,
} from '@piar/domain-models';
import type { DynamicPageOrmEntity } from './orm.entity';

export type DynamicPageRecord = DeepPartial<DynamicPageOrmEntity>;

export class DynamicPageFactory {
  static toDomain(data: DynamicPageRecord): DynamicPageEntityProps {
    return {
      id: data.id ?? '',
      pageCode: data.pageCode ?? '',
      slug: data.slug ?? '',
      status: (data.status as DynamicPageStatus | null) ?? undefined,
      hero: (data.hero as DynamicPageHero) ?? { title: [] },
      sections: (data.sections as DynamicPageSection[] | null) ?? undefined,
      seo: (data.seo as DynamicPageSeo | null) ?? undefined,
      isActive: data.isActive ?? undefined,
      webPriority: data.webPriority ?? undefined,
      showOnPublicWeb: data.showOnPublicWeb ?? undefined,
      metadata: (data.metadata as Record<string, unknown> | null) ?? undefined,
      createdAt: (data.createdAt as Date | undefined) ?? new Date(),
      updatedAt: (data.updatedAt as Date | undefined) ?? new Date(),
    };
  }

  static fromDomain(entity: DynamicPageEntityProps): DynamicPageRecord {
    return {
      id: entity.id,
      pageCode: entity.pageCode,
      slug: entity.slug,
      status: entity.status ?? undefined,
      hero: (entity.hero as unknown) ?? null,
      sections: (entity.sections as unknown) ?? null,
      seo: (entity.seo as unknown) ?? null,
      isActive: entity.isActive ?? undefined,
      webPriority: entity.webPriority ?? undefined,
      showOnPublicWeb: entity.showOnPublicWeb ?? undefined,
      metadata: (entity.metadata as Record<string, unknown> | null) ?? null,
      createdAt: entity.createdAt ?? new Date(),
      updatedAt: entity.updatedAt ?? new Date(),
    };
  }

  static toDomainList(dataList: DynamicPageRecord[]): DynamicPageEntityProps[] {
    return dataList.map((data) => DynamicPageFactory.toDomain(data));
  }
}
