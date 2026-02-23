import { BasePort } from '../base/base.port';
import { ContactSubmissionEntityProps } from './contact-submission.entity';

export interface ContactSubmissionPort extends BasePort<ContactSubmissionEntityProps> {}

export const ContactSubmissionPort = Symbol('ContactSubmissionPort');
