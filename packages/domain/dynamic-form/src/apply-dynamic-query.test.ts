import { describe, expect, it } from 'vitest';
import { applyDynamicQuery } from './apply-dynamic-query';

describe('applyDynamicQuery', () => {
  it('paginates and counts total after filters', () => {
    const rows = [
      { id: '1', name: 'Alpha', isActive: true },
      { id: '2', name: 'Beta', isActive: false },
      { id: '3', name: 'Gamma', isActive: true },
    ];

    const res = applyDynamicQuery(rows, {
      page: 1,
      limit: 1,
      filters: { isActive: true },
    });

    expect(res.total).toBe(2);
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0]?.id).toBe('1');
  });

  it('searches by configured keys', () => {
    const rows = [
      { id: '1', clientCode: 'PIAR', name: 'Piar Concept' },
      { id: '2', clientCode: 'CHC', name: 'Catalonia HC' },
    ];

    const res = applyDynamicQuery(
      rows,
      {
        page: 1,
        limit: 10,
        searchQuery: 'piar',
      },
      { searchKeys: ['clientCode', 'name'] },
    );

    expect(res.total).toBe(1);
    expect(res.rows[0]?.id).toBe('1');
  });
});
