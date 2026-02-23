import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { ContactSubmissionEntity, ContactSubmissionEntityProps } from '@piar/domain-models';

/**
 * Contact submission creation payload.
 */
export type CreateContactSubmissionPayload = Omit<
  ContactSubmissionEntityProps,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Contact submission update payload.
 */
export type UpdateContactSubmissionPayload = Partial<CreateContactSubmissionPayload> & {
  id: string;
};

/**
 * Contact submission repository port (interface)
 * Defines the contract for contact submission CRUD operations.
 */
export interface IContactSubmissionRepository {
  list(query: DynamicQuery): Promise<PaginatedResult<ContactSubmissionEntity>>;
  getById(id: string): Promise<ContactSubmissionEntity | null>;
  create(payload: CreateContactSubmissionPayload): Promise<ContactSubmissionEntity>;
  update(payload: UpdateContactSubmissionPayload): Promise<ContactSubmissionEntity>;
  delete(id: string): Promise<void>;
}

export const IContactSubmissionRepository = Symbol('IContactSubmissionRepository');
