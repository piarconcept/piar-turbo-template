import { describe, expect, it } from 'vitest';
import type { DynamicQuery } from './types';

describe('domain-dynamic-form types', () => {
  it('DynamicQuery shape is compatible with pagination', () => {
    const q: DynamicQuery = { page: 1, limit: 10 };
    expect(q.page).toBe(1);
    expect(q.limit).toBe(10);
  });
});
