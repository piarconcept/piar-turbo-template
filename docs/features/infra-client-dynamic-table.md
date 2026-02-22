# Infra (client): Dynamic Table

This template includes a minimal, typed client helper for querying metadata-driven list endpoints.

Package:

- `@piar/infra-client-dynamic-table`

It is intentionally **UI-agnostic**: it only helps build query params and typed clients.

## Example

```ts
import { createDynamicTableClient } from '@piar/infra-client-dynamic-table';
import { HttpClient } from '@piar/infra-client-common-http';

type ClientDto = { id: string; name: string };

const http = new HttpClient('http://localhost:5050');
const client = createDynamicTableClient<ClientDto>(http, { path: '/clients' });

const result = await client.list({
  page: 1,
  limit: 10,
  searchQuery: 'foo',
});
```
