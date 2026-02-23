import { NotFoundError } from '@piar/domain-models';
import type { IContactSubmissionRepository } from '@piar/contact-configuration';

export interface DeleteContactSubmissionUseCase {
  execute(id: string): Promise<void>;
}

export const DeleteContactSubmissionUseCase = Symbol('DeleteContactSubmissionUseCase');

export class DeleteContactSubmissionUseCaseExecuter implements DeleteContactSubmissionUseCase {
  constructor(private readonly repository: IContactSubmissionRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.getById(id);
    if (!existing) {
      throw new NotFoundError('ContactSubmission', id, 'contact_submission_not_found');
    }
    await this.repository.delete(id);
  }
}
