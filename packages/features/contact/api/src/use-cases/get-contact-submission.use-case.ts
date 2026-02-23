import type { ContactSubmissionEntity } from '@piar/domain-models';
import { NotFoundError } from '@piar/domain-models';
import type { IContactSubmissionRepository } from '@piar/contact-configuration';

export interface GetContactSubmissionUseCase {
  execute(id: string): Promise<ContactSubmissionEntity>;
}

export const GetContactSubmissionUseCase = Symbol('GetContactSubmissionUseCase');

export class GetContactSubmissionUseCaseExecuter implements GetContactSubmissionUseCase {
  constructor(private readonly repository: IContactSubmissionRepository) {}

  async execute(id: string): Promise<ContactSubmissionEntity> {
    const contact = await this.repository.getById(id);
    if (!contact) {
      throw new NotFoundError('ContactSubmission', id, 'contact_submission_not_found');
    }
    return contact;
  }
}
