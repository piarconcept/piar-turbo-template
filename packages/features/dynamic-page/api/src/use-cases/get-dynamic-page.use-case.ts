import type { IDynamicPageRepository } from '@piar/dynamic-page-configuration';
import { DynamicPageEntity, NotFoundError } from '@piar/domain-models';

export interface GetDynamicPageUseCase {
  execute(id: string): Promise<DynamicPageEntity>;
}

export const GetDynamicPageUseCase = Symbol('GetDynamicPageUseCase');

export class GetDynamicPageUseCaseExecuter implements GetDynamicPageUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(id: string): Promise<DynamicPageEntity> {
    const page = await this.repository.getById(id);
    if (!page) {
      throw new NotFoundError('DynamicPage', id, 'dynamic_page_not_found');
    }
    return page;
  }
}
