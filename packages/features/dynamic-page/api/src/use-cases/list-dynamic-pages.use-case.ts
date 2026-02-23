import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { DynamicPageEntity } from '@piar/domain-models';
import type { IDynamicPageRepository } from '@piar/dynamic-page-configuration';

export interface ListDynamicPagesUseCase {
  execute(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntity>>;
}

export const ListDynamicPagesUseCase = Symbol('ListDynamicPagesUseCase');

export class ListDynamicPagesUseCaseExecuter implements ListDynamicPagesUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(query: DynamicQuery): Promise<PaginatedResult<DynamicPageEntity>> {
    return this.repository.list(query);
  }
}
