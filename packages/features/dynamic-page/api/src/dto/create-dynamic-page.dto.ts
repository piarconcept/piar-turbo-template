import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateDynamicPagePayload } from '@piar/dynamic-page-configuration';
import type {
  DynamicPageHero,
  DynamicPageSection,
  DynamicPageSeo,
  DynamicPageStatus,
} from '@piar/domain-models';

export class CreateDynamicPageDto implements CreateDynamicPagePayload {
  @ApiProperty({
    description: 'Unique page code',
    example: 'PAGE-ABOUT',
    type: String,
  })
  pageCode!: string;

  @ApiProperty({
    description: 'Page slug',
    example: 'about',
    type: String,
  })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Page status',
    enum: ['draft', 'published', 'archived'],
    type: String,
  })
  status?: DynamicPageStatus;

  @ApiProperty({
    description: 'Hero configuration',
    example: { title: { en: 'About us' }, subtitle: { en: 'What we build' } },
    type: Object,
  })
  hero!: DynamicPageHero;

  @ApiPropertyOptional({
    description: 'Page sections',
    type: [Object],
  })
  sections?: DynamicPageSection[];

  @ApiPropertyOptional({
    description: 'SEO metadata',
    type: Object,
  })
  seo?: DynamicPageSeo;

  @ApiPropertyOptional({
    description: 'Whether the page is active',
    type: Boolean,
  })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Priority for ordering on public web',
    type: Number,
  })
  webPriority?: number;

  @ApiPropertyOptional({
    description: 'Show page on public web',
    type: Boolean,
  })
  showOnPublicWeb?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    type: Object,
  })
  metadata?: Record<string, unknown>;
}
