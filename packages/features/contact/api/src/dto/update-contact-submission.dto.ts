import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ContactSubmissionStatus } from '@piar/domain-models';
import type { UpdateContactSubmissionPayload } from '@piar/contact-configuration';

export class UpdateContactSubmissionDto implements Omit<UpdateContactSubmissionPayload, 'id'> {
  @ApiPropertyOptional({ description: 'Contact name', type: String })
  name?: string;

  @ApiPropertyOptional({ description: 'Contact email', type: String })
  email?: string;

  @ApiPropertyOptional({ description: 'Contact message', type: String })
  message?: string;

  @ApiPropertyOptional({ description: 'Consent to store data', type: Boolean })
  consent?: boolean;

  @ApiPropertyOptional({ description: 'Last visited pages before submission', type: [String] })
  lastPages?: string[];

  @ApiPropertyOptional({ description: 'Locale detected on the website', type: String })
  locale?: string;

  @ApiPropertyOptional({ description: 'Submission source', type: String })
  source?: string;

  @ApiPropertyOptional({
    description: 'Submission status',
    enum: ['new', 'archived'],
  })
  status?: ContactSubmissionStatus;

  @ApiPropertyOptional({
    description: 'Additional metadata (user agent, referrer, etc.)',
    type: Object,
  })
  metadata?: Record<string, string>;
}
