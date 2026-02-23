import type { ContactSubmissionEntity } from '@piar/domain-models';
import type {
  IContactSubmissionRepository,
  UpdateContactSubmissionPayload,
} from '@piar/contact-configuration';

export interface UpdateContactSubmissionUseCase {
  execute(payload: UpdateContactSubmissionPayload): Promise<ContactSubmissionEntity>;
}

export const UpdateContactSubmissionUseCase = Symbol('UpdateContactSubmissionUseCase');

export class UpdateContactSubmissionUseCaseExecuter implements UpdateContactSubmissionUseCase {
  constructor(private readonly repository: IContactSubmissionRepository) {}

  async execute(payload: UpdateContactSubmissionPayload): Promise<ContactSubmissionEntity> {
    return this.repository.update(payload);
  }
}
