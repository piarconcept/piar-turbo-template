import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { ContactSubmissionEntity } from '@piar/domain-models';
import type { IContactSubmissionRepository } from '@piar/contact-configuration';

export interface ListContactSubmissionsUseCase {
  execute(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntity>>;
}

export const ListContactSubmissionsUseCase = Symbol('ListContactSubmissionsUseCase');

export class ListContactSubmissionsUseCaseExecuter implements ListContactSubmissionsUseCase {
  constructor(private readonly repository: IContactSubmissionRepository) {}

  async execute(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntity>> {
    return this.repository.list(query);
  }
}
