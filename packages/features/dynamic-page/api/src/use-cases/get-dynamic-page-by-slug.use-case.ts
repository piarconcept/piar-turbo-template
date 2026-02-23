import type { IDynamicPageRepository } from '@piar/dynamic-page-configuration';
import { DynamicPageEntity, NotFoundError } from '@piar/domain-models';

export interface GetDynamicPageBySlugUseCase {
  execute(slug: string): Promise<DynamicPageEntity>;
}

export const GetDynamicPageBySlugUseCase = Symbol('GetDynamicPageBySlugUseCase');

export class GetDynamicPageBySlugUseCaseExecuter implements GetDynamicPageBySlugUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(slug: string): Promise<DynamicPageEntity> {
    const page = await this.repository.getBySlug(slug);
    if (!page) {
      throw new NotFoundError('DynamicPage', slug, 'dynamic_page_not_found');
    }
    return page;
  }
}
