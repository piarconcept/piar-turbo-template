import { ApiPropertyOptional } from '@nestjs/swagger';
import type { UpdateDynamicPagePayload } from '@piar/dynamic-page-configuration';
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

export class UpdateDynamicPageDto implements Omit<UpdateDynamicPagePayload, 'id'> {
  @ApiPropertyOptional({
    description: 'Page code',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9_-]+$/)
  pageCode?: string;

  @ApiPropertyOptional({
    description: 'Page slug',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({
    description: 'Page status',
    enum: ['draft', 'published', 'archived'],
    type: String,
  })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: DynamicPageStatus;

  @ApiPropertyOptional({
    description: 'Hero configuration',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  hero?: DynamicPageHero;

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
