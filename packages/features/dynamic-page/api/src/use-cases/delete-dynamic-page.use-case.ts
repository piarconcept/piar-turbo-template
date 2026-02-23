import type { IDynamicPageRepository } from '@piar/dynamic-page-configuration';
import { NotFoundError } from '@piar/domain-models';

export interface DeleteDynamicPageUseCase {
  execute(id: string): Promise<void>;
}

export const DeleteDynamicPageUseCase = Symbol('DeleteDynamicPageUseCase');

export class DeleteDynamicPageUseCaseExecuter implements DeleteDynamicPageUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new NotFoundError('DynamicPage', id, 'dynamic_page_not_found');
    }
    await this.repository.delete(id);
  }
}
