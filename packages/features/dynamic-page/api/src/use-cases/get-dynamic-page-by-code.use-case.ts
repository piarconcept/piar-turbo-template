import type { IDynamicPageRepository } from '@piar/dynamic-page-configuration';
import { DynamicPageEntity, NotFoundError } from '@piar/domain-models';

export interface GetDynamicPageByCodeUseCase {
  execute(pageCode: string): Promise<DynamicPageEntity>;
}

export const GetDynamicPageByCodeUseCase = Symbol('GetDynamicPageByCodeUseCase');

export class GetDynamicPageByCodeUseCaseExecuter implements GetDynamicPageByCodeUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(pageCode: string): Promise<DynamicPageEntity> {
    const page = await this.repository.getByPageCode(pageCode);
    if (!page) {
      throw new NotFoundError('DynamicPage', pageCode, 'dynamic_page_not_found');
    }
    return page;
  }
}
