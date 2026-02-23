import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateContactSubmissionPayload } from '@piar/contact-configuration';

export class CreateContactSubmissionDto implements CreateContactSubmissionPayload {
  @ApiProperty({
    description: 'Contact name',
    example: 'Jane Doe',
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'jane@company.com',
    type: String,
  })
  email!: string;

  @ApiProperty({
    description: 'Contact message',
    example: 'We would like to discuss a new project.',
    type: String,
  })
  message!: string;

  @ApiProperty({
    description: 'Consent to store data',
    type: Boolean,
  })
  consent!: boolean;

  @ApiPropertyOptional({
    description: 'Last visited pages before submission',
    type: [String],
  })
  lastPages?: string[];

  @ApiPropertyOptional({
    description: 'Locale detected on the website',
    example: 'es',
    type: String,
  })
  locale?: string;

  @ApiPropertyOptional({
    description: 'Submission source',
    example: 'web',
    type: String,
  })
  source?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata (user agent, referrer, etc.)',
    type: Object,
  })
  metadata?: Record<string, string>;
}
