import { Inject, Injectable, Logger } from '@nestjs/common';
import { AccountPort, type AccountEntityProps } from '@piar/domain-models';
import type {
  BackofficeSearchCollection,
  BackofficeSearchItem,
  BackofficeSearchResponse,
  SearchBackofficeInput,
} from '../types';

const DEFAULT_LIMIT_PER_COLLECTION = 6;
const MAX_LIMIT_PER_COLLECTION = 50;

interface SearchBackofficeUseCaseOutput extends BackofficeSearchResponse {}

export interface SearchBackofficeUseCase {
  execute(input: SearchBackofficeInput): Promise<SearchBackofficeUseCaseOutput>;
}

export const SearchBackofficeUseCase = Symbol('SearchBackofficeUseCase');

@Injectable()
export class SearchBackofficeUseCaseExecuter implements SearchBackofficeUseCase {
  private readonly logger = new Logger(SearchBackofficeUseCaseExecuter.name);

  constructor(
    @Inject(AccountPort)
    private readonly accountPort: AccountPort,
  ) {}

  async execute(input: SearchBackofficeInput): Promise<SearchBackofficeUseCaseOutput> {
    const normalizedQuery = input.query.trim();

    if (!normalizedQuery) {
      return { query: '', total: 0, collections: [] };
    }

    const limitPerCollection = this.resolveLimit(input.limitPerCollection);
    const accountsCollection = await this.searchAccounts(normalizedQuery, limitPerCollection);
    const collections = accountsCollection.total > 0 ? [accountsCollection] : [];

    return {
      query: normalizedQuery,
      total: accountsCollection.total,
      collections,
    };
  }

  private resolveLimit(limitPerCollection?: number): number {
    if (!Number.isFinite(limitPerCollection)) return DEFAULT_LIMIT_PER_COLLECTION;
    const value = Math.floor(limitPerCollection as number);
    if (value <= 0) return DEFAULT_LIMIT_PER_COLLECTION;
    return Math.min(value, MAX_LIMIT_PER_COLLECTION);
  }

  private async searchAccounts(
    query: string,
    limitPerCollection: number,
  ): Promise<BackofficeSearchCollection> {
    try {
      const result = await this.accountPort.list({
        page: 1,
        limit: limitPerCollection,
        searchQuery: query,
        sort: {
          key: 'updatedAt',
          direction: 'desc',
        },
      });

      const items = result.rows
        .map((account) => this.toAccountSearchItem(account))
        .filter((item): item is BackofficeSearchItem => Boolean(item));

      return {
        key: 'accounts',
        total: result.total,
        items,
      };
    } catch (error) {
      this.logger.error('Search failed for accounts collection', error);
      return {
        key: 'accounts',
        total: 0,
        items: [],
      };
    }
  }

  private toAccountSearchItem(account: AccountEntityProps): BackofficeSearchItem | null {
    if (!account.id || !account.accountCode) return null;

    return {
      id: account.id,
      title: account.accountCode,
      subtitle: this.normalizeText(account.email),
      description: this.normalizeText(account.role),
      path: `/accounts/${account.id}`,
      updatedAt: this.normalizeDate(account.updatedAt),
    };
  }

  private normalizeText(value?: string): string | undefined {
    const normalized = value?.trim();
    return normalized ? normalized : undefined;
  }

  private normalizeDate(value?: Date | string): string | undefined {
    if (!value) return undefined;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
  }
}
