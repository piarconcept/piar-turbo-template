import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { DynamicPageEntity } from '@piar/domain-models';
import { AdminGuard, JwtAuthGuard } from '@piar/infra-backend-common-security';
import {
  CreateDynamicPageUseCase,
  DeleteDynamicPageUseCase,
  GetDynamicPageByCodeUseCase,
  GetDynamicPageBySlugUseCase,
  GetDynamicPageUseCase,
  ListDynamicPagesUseCase,
  NormalizeDynamicPagesUseCase,
  UpdateDynamicPageUseCase,
} from '../use-cases';
import { CreateDynamicPageDto, UpdateDynamicPageDto } from '../dto';

function parseFilters(filters?: string): DynamicQuery['filters'] | undefined {
  if (!filters) return undefined;

  try {
    const parsed = JSON.parse(filters) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as DynamicQuery['filters'];
    }
  } catch {
    return undefined;
  }

  return undefined;
}

@ApiBearerAuth()
@ApiTags('Dynamic Pages')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('dynamic-pages')
export class DynamicPageController {
  constructor(
    @Inject(ListDynamicPagesUseCase)
    private readonly listDynamicPagesUseCase: ListDynamicPagesUseCase,
    @Inject(GetDynamicPageUseCase)
    private readonly getDynamicPageUseCase: GetDynamicPageUseCase,
    @Inject(GetDynamicPageByCodeUseCase)
    private readonly getDynamicPageByCodeUseCase: GetDynamicPageByCodeUseCase,
    @Inject(GetDynamicPageBySlugUseCase)
    private readonly getDynamicPageBySlugUseCase: GetDynamicPageBySlugUseCase,
    @Inject(CreateDynamicPageUseCase)
    private readonly createDynamicPageUseCase: CreateDynamicPageUseCase,
    @Inject(UpdateDynamicPageUseCase)
    private readonly updateDynamicPageUseCase: UpdateDynamicPageUseCase,
    @Inject(DeleteDynamicPageUseCase)
    private readonly deleteDynamicPageUseCase: DeleteDynamicPageUseCase,
    @Inject(NormalizeDynamicPagesUseCase)
    private readonly normalizeDynamicPagesUseCase: NormalizeDynamicPagesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List dynamic pages' })
  @ApiResponse({ status: 200, description: 'Dynamic page list (paginated)' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('searchQuery') searchQuery?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ): Promise<PaginatedResult<DynamicPageEntity>> {
    const query: DynamicQuery = {
      page: Number(page),
      limit: Number(limit),
      searchQuery: searchQuery || undefined,
      sort: sortKey
        ? {
            key: sortKey,
            direction: sortDirection === 'desc' ? 'desc' : 'asc',
          }
        : undefined,
      filters: parseFilters(filters),
    };

    return this.listDynamicPagesUseCase.execute(query);
  }

  @Get('code/:pageCode')
  @ApiOperation({ summary: 'Get dynamic page by code' })
  @ApiParam({ name: 'pageCode', type: String })
  @ApiResponse({ status: 200, description: 'Dynamic page found' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async getByCode(@Param('pageCode') pageCode: string): Promise<DynamicPageEntity> {
    return this.getDynamicPageByCodeUseCase.execute(pageCode);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get dynamic page by slug' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Dynamic page found' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async getBySlug(@Param('slug') slug: string): Promise<DynamicPageEntity> {
    return this.getDynamicPageBySlugUseCase.execute(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dynamic page by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Dynamic page found' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async getById(@Param('id') id: string): Promise<DynamicPageEntity> {
    return this.getDynamicPageUseCase.execute(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create dynamic page' })
  @ApiBody({ type: CreateDynamicPageDto })
  @ApiResponse({ status: 201, description: 'Dynamic page created' })
  async create(@Body() payload: CreateDynamicPageDto): Promise<DynamicPageEntity> {
    return this.createDynamicPageUseCase.execute(payload);
  }

  @Post('normalize')
  @ApiOperation({ summary: 'Normalize dynamic pages content' })
  @ApiQuery({
    name: 'publish',
    required: false,
    description: 'Set to true to publish all normalized pages',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Dynamic pages normalized' })
  async normalize(@Query('publish') publish?: string) {
    return this.normalizeDynamicPagesUseCase.execute({
      publish: publish === 'true',
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update dynamic page' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateDynamicPageDto })
  @ApiResponse({ status: 200, description: 'Dynamic page updated' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateDynamicPageDto,
  ): Promise<DynamicPageEntity> {
    return this.updateDynamicPageUseCase.execute({ id, ...payload });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete dynamic page' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Dynamic page deleted' })
  @ApiResponse({ status: 404, description: 'Dynamic page not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteDynamicPageUseCase.execute(id);
  }
}
