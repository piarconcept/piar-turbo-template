import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateContactSubmissionPayload } from '@piar/contact-configuration';
import {
  ArrayMaxSize,
  Equals,
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactSubmissionDto implements CreateContactSubmissionPayload {
  @ApiProperty({
    description: 'Contact name',
    example: 'Jane Doe',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @ApiProperty({
    description: 'Contact email',
    example: 'jane@company.com',
    type: String,
  })
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @ApiProperty({
    description: 'Contact message',
    example: 'We would like to discuss a new project.',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  message!: string;

  @ApiProperty({
    description: 'Consent to store data',
    type: Boolean,
  })
  @Equals(true)
  consent!: boolean;

  @ApiPropertyOptional({
    description: 'Last visited pages before submission',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  lastPages?: string[];

  @ApiPropertyOptional({
    description: 'Locale detected on the website',
    example: 'es',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/)
  locale?: string;

  @ApiPropertyOptional({
    description: 'Submission source',
    example: 'web',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  source?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata (user agent, referrer, etc.)',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
