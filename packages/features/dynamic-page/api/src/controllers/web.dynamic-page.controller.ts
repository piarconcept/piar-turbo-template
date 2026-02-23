import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { DynamicPageEntityProps } from '@piar/domain-models';
import { GetPublicDynamicPageBySlugUseCase } from '../use-cases';

@ApiTags('Public Dynamic Pages')
@Controller('dynamic-pages')
export class WebDynamicPageController {
  constructor(
    @Inject(GetPublicDynamicPageBySlugUseCase)
    private readonly getPublicDynamicPageBySlugUseCase: GetPublicDynamicPageBySlugUseCase,
  ) {}

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get dynamic page by slug (public)' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Dynamic page found' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async getBySlug(
    @Param('slug') slug: string,
    @Query('active') active = 'true',
    @Query('public') publicOnly = 'true',
    @Query('status') status = 'published',
  ): Promise<DynamicPageEntityProps> {
    const shouldFilterActive = active !== 'false' && active !== '0';
    const shouldFilterPublic = publicOnly !== 'false' && publicOnly !== '0';
    return this.getPublicDynamicPageBySlugUseCase.execute(slug, {
      active: shouldFilterActive,
      publicOnly: shouldFilterPublic,
      status,
    });
  }
}
