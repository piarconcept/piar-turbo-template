import { Body, Controller, Delete, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard, JwtAuthGuard, type JwtPayload } from '@piar/infra-backend-common-security';
import type { Request } from 'express';
import { AccountsService, type AccountPublic, type PaginatedAccounts } from './accounts.service';
import { UpdateAccountDto } from './dto/update-account.dto';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

interface SortQuery {
  key: string;
  direction: 'asc' | 'desc';
}

interface AccountsQuery {
  page: number;
  limit: number;
  searchQuery?: string;
  sort?: SortQuery;
  filters?: Record<string, unknown>;
}

function parseFilters(filters?: string): Record<string, unknown> | undefined {
  if (!filters) return undefined;

  try {
    const parsed = JSON.parse(filters) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

@ApiBearerAuth()
@ApiTags('Accounts')
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List accounts' })
  @ApiResponse({ status: 200, description: 'Accounts list (paginated)' })
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('searchQuery') searchQuery?: string,
    @Query('sortKey') sortKey?: string,
    @Query('sortDirection') sortDirection?: 'asc' | 'desc',
    @Query('filters') filters?: string,
  ): Promise<PaginatedAccounts> {
    const query: AccountsQuery = {
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

    return this.accountsService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getById(@Param('id') id: string): Promise<AccountPublic> {
    return this.accountsService.getById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 403, description: 'Forbidden action' })
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateAccountDto,
    @Req() request: RequestWithUser,
  ): Promise<AccountPublic> {
    return this.accountsService.update(id, payload, request.user?.accountId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 403, description: 'Forbidden action' })
  async delete(@Param('id') id: string, @Req() request: RequestWithUser): Promise<void> {
    await this.accountsService.delete(id, request.user?.accountId);
  }
}
