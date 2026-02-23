import { BaseEntity, BaseEntityProps } from '../base/base.entity.js';

export type ContactSubmissionStatus = 'new' | 'archived';

export interface ContactSubmissionEntityProps extends BaseEntityProps {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  lastPages?: string[];
  locale?: string;
  source?: string;
  status?: ContactSubmissionStatus;
  metadata?: Record<string, string>;
}

export class ContactSubmissionEntity extends BaseEntity implements ContactSubmissionEntityProps {
  name: string;
  email: string;
  message: string;
  consent: boolean;
  lastPages?: string[];
  locale?: string;
  source?: string;
  status?: ContactSubmissionStatus;
  metadata?: Record<string, string>;

  constructor(props: ContactSubmissionEntityProps) {
    super(props);
    this.name = props.name;
    this.email = props.email;
    this.message = props.message;
    this.consent = props.consent;
    this.lastPages = props.lastPages;
    this.locale = props.locale;
    this.source = props.source;
    this.status = props.status;
    this.metadata = props.metadata;
  }
}
