import type {
  CreateDynamicPagePayload,
  IDynamicPageRepository,
} from '@piar/dynamic-page-configuration';
import type { DynamicPageEntity } from '@piar/domain-models';

export interface CreateDynamicPageUseCase {
  execute(payload: CreateDynamicPagePayload): Promise<DynamicPageEntity>;
}

export const CreateDynamicPageUseCase = Symbol('CreateDynamicPageUseCase');

export class CreateDynamicPageUseCaseExecuter implements CreateDynamicPageUseCase {
  constructor(private readonly repository: IDynamicPageRepository) {}

  async execute(payload: CreateDynamicPagePayload): Promise<DynamicPageEntity> {
    return this.repository.create(payload);
  }
}
