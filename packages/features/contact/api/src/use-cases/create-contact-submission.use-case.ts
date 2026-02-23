import type { ContactSubmissionEntity } from '@piar/domain-models';
import type {
  CreateContactSubmissionPayload,
  IContactSubmissionRepository,
} from '@piar/contact-configuration';

export interface CreateContactSubmissionUseCase {
  execute(payload: CreateContactSubmissionPayload): Promise<ContactSubmissionEntity>;
}

export const CreateContactSubmissionUseCase = Symbol('CreateContactSubmissionUseCase');

export class CreateContactSubmissionUseCaseExecuter implements CreateContactSubmissionUseCase {
  constructor(private readonly repository: IContactSubmissionRepository) {}

  async execute(payload: CreateContactSubmissionPayload): Promise<ContactSubmissionEntity> {
    return this.repository.create({
      ...payload,
      status: payload.status ?? 'new',
    });
  }
}
