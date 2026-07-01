export type SearchCollectionKey = 'accounts';

export interface BackofficeSearchItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  path: string;
  updatedAt?: string;
}

export interface BackofficeSearchCollection {
  key: SearchCollectionKey;
  total: number;
  items: BackofficeSearchItem[];
}

export interface BackofficeSearchResponse {
  query: string;
  total: number;
  collections: BackofficeSearchCollection[];
}

export interface SearchBackofficeInput {
  query: string;
  locale?: string;
  limitPerCollection?: number;
}
