import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { DynamicQuery, PaginatedResult } from '@piar/domain-dynamic-form';
import type { ContactSubmissionEntity } from '@piar/domain-models';
import { AdminGuard, JwtAuthGuard } from '@piar/infra-backend-common-security';
import {
  DeleteContactSubmissionUseCase,
  GetContactSubmissionUseCase,
  ListContactSubmissionsUseCase,
  UpdateContactSubmissionUseCase,
} from '../use-cases';
import { UpdateContactSubmissionDto } from '../dto';

@ApiBearerAuth()
@ApiTags('Contact Submissions')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('contact-submissions')
export class ContactSubmissionController {
  constructor(
    @Inject(ListContactSubmissionsUseCase)
    private readonly listContactSubmissionsUseCase: ListContactSubmissionsUseCase,
    @Inject(GetContactSubmissionUseCase)
    private readonly getContactSubmissionUseCase: GetContactSubmissionUseCase,
    @Inject(DeleteContactSubmissionUseCase)
    private readonly deleteContactSubmissionUseCase: DeleteContactSubmissionUseCase,
    @Inject(UpdateContactSubmissionUseCase)
    private readonly updateContactSubmissionUseCase: UpdateContactSubmissionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List contact submissions' })
  @ApiResponse({ status: 200, description: 'Contact submissions list (paginated)' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('searchQuery') searchQuery?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ): Promise<PaginatedResult<ContactSubmissionEntity>> {
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
      filters: filters ? (JSON.parse(filters) as DynamicQuery['filters']) : undefined,
    };

    return this.listContactSubmissionsUseCase.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact submission by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Contact submission found' })
  @ApiResponse({ status: 404, description: 'Contact submission not found' })
  async getById(@Param('id') id: string): Promise<ContactSubmissionEntity> {
    return this.getContactSubmissionUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact submission' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Contact submission updated' })
  @ApiResponse({ status: 404, description: 'Contact submission not found' })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateContactSubmissionDto,
  ): Promise<ContactSubmissionEntity> {
    return this.updateContactSubmissionUseCase.execute({ id, ...payload });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact submission' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Contact submission deleted' })
  @ApiResponse({ status: 404, description: 'Contact submission not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteContactSubmissionUseCase.execute(id);
  }
}
