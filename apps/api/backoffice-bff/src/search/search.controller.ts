import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard, JwtAuthGuard } from '@piar/infra-backend-common-security';
import type { BackofficeSearchResponse } from './types';
import {
  SearchBackofficeUseCase,
  type SearchBackofficeUseCase as SearchUseCase,
} from './use-cases/search-backoffice.use-case';

@ApiBearerAuth()
@ApiTags('Search')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('search')
export class SearchController {
  constructor(
    @Inject(SearchBackofficeUseCase)
    private readonly searchBackofficeUseCase: SearchUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search across backoffice collections' })
  @ApiQuery({ name: 'q', type: String, required: true })
  @ApiQuery({ name: 'locale', type: String, required: false })
  @ApiQuery({ name: 'limitPerCollection', type: Number, required: false })
  @ApiResponse({ status: 200, description: 'Backoffice search response' })
  async search(
    @Query('q') query = '',
    @Query('locale') locale?: string,
    @Query('limitPerCollection') limitPerCollection?: string,
  ): Promise<BackofficeSearchResponse> {
    return this.searchBackofficeUseCase.execute({
      query,
      locale,
      limitPerCollection: limitPerCollection ? Number(limitPerCollection) : undefined,
    });
  }
}
