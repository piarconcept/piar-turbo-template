import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ContactSubmissionStatus } from '@piar/domain-models';
import type { UpdateContactSubmissionPayload } from '@piar/contact-configuration';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateContactSubmissionDto implements Omit<UpdateContactSubmissionPayload, 'id'> {
  @ApiPropertyOptional({ description: 'Contact name', type: String })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ description: 'Contact email', type: String })
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @ApiPropertyOptional({ description: 'Contact message', type: String })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message?: string;

  @ApiPropertyOptional({ description: 'Consent to store data', type: Boolean })
  @IsOptional()
  @IsBoolean()
  consent?: boolean;

  @ApiPropertyOptional({ description: 'Last visited pages before submission', type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  lastPages?: string[];

  @ApiPropertyOptional({ description: 'Locale detected on the website', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/)
  locale?: string;

  @ApiPropertyOptional({ description: 'Submission source', type: String })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  source?: string;

  @ApiPropertyOptional({
    description: 'Submission status',
    enum: ['new', 'archived'],
  })
  @IsOptional()
  @IsIn(['new', 'archived'])
  status?: ContactSubmissionStatus;

  @ApiPropertyOptional({
    description: 'Additional metadata (user agent, referrer, etc.)',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
