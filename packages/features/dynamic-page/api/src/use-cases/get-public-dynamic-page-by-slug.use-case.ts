import { DynamicPageEntityProps, DynamicPagePort, NotFoundError } from '@piar/domain-models';

export interface GetPublicDynamicPageBySlugUseCase {
  execute(
    slug: string,
    options?: { active?: boolean; publicOnly?: boolean; status?: string },
  ): Promise<DynamicPageEntityProps>;
}

export const GetPublicDynamicPageBySlugUseCase = Symbol('GetPublicDynamicPageBySlugUseCase');

export class GetPublicDynamicPageBySlugUseCaseExecuter implements GetPublicDynamicPageBySlugUseCase {
  constructor(private readonly dynamicPagePort: DynamicPagePort) {}

  async execute(
    slug: string,
    options?: { active?: boolean; publicOnly?: boolean; status?: string },
  ): Promise<DynamicPageEntityProps> {
    const page = await this.dynamicPagePort.getBySlug(slug);
    const shouldFilterActive = options?.active !== false;
    const shouldFilterPublic = options?.publicOnly !== false;
    const status = options?.status ?? 'published';
    const shouldFilterStatus = status !== 'any' && status !== 'all' && status !== 'none';

    if (
      !page ||
      (shouldFilterActive && page.isActive === false) ||
      (shouldFilterPublic && page.showOnPublicWeb === false) ||
      (shouldFilterStatus && page.status !== status)
    ) {
      throw new NotFoundError('DynamicPage', slug, 'dynamic_page_not_found');
    }

    return page;
  }
}
