import type {
  IDynamicPageRepository,
  UpdateDynamicPagePayload,
} from '@piar/dynamic-page-configuration';
import { DynamicPageEntity, NotFoundError } from '@piar/domain-models';

export interface UpdateDynamicPageUseCase {
  execute(payload: UpdateDynamicPagePayload): Promise<DynamicPageEntity>;
}

export const UpdateDynamicPageUseCase = Symbol('UpdateDynamicPageUseCase');

export class UpdateDynamicPageUseCaseExecuter implements UpdateDynamicPageUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(payload: UpdateDynamicPagePayload): Promise<DynamicPageEntity> {
    const existing = await this.repository.getById(payload.id);
    if (!existing) {
      throw new NotFoundError('DynamicPage', payload.id, 'dynamic_page_not_found');
    }
    return this.repository.update(payload);
  }
}
