import { describe, expectTypeOf, it } from 'vitest';
import type { DynamicCrudPort } from './ports';

type Entity = { id: string; name: string };

describe('DynamicCrudPort', () => {
  it('is generic over entity', () => {
    expectTypeOf<DynamicCrudPort<Entity>>().toBeObject();
  });
});
