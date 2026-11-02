import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateDynamicPagePayload } from '@piar/dynamic-page-configuration';
import type {
  DynamicPageHero,
  DynamicPageSection,
  DynamicPageSeo,
  DynamicPageStatus,
} from '@piar/domain-models';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDynamicPageDto implements CreateDynamicPagePayload {
  @ApiProperty({
    description: 'Unique page code',
    example: 'PAGE-ABOUT',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  pageCode!: string;

  @ApiProperty({
    description: 'Page slug',
    example: 'about',
    type: String,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @ApiPropertyOptional({
    description: 'Page status',
    enum: ['draft', 'published', 'archived'],
    type: String,
  })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: DynamicPageStatus;

  @ApiProperty({
    description: 'Hero configuration',
    example: { title: { en: 'About us' }, subtitle: { en: 'What we build' } },
    type: Object,
  })
  @IsObject()
  hero!: DynamicPageHero;

  @ApiPropertyOptional({
    description: 'Page sections',
    type: [Object],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsObject({ each: true })
  sections?: DynamicPageSection[];

  @ApiPropertyOptional({
    description: 'SEO metadata',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  seo?: DynamicPageSeo;

  @ApiPropertyOptional({
    description: 'Whether the page is active',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Priority for ordering on public web',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000000)
  webPriority?: number;

  @ApiPropertyOptional({
    description: 'Show page on public web',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  showOnPublicWeb?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
