# @piar/infra-client-common-http

HTTP client infrastructure for client applications. Provides a clean axios-based HTTP client with standardized error handling.

## Usage

```typescript
import { HttpClient } from '@piar/infra-client-common-http';

const client = new HttpClient('https://api.example.com');

// POST request
const data = await client.post('/auth/login', { email, password });

// GET request
const user = await client.get('/users/123');

// PUT request
await client.put('/users/123', { name: 'John' });

// PATCH request
await client.patch('/users/123', { status: 'active' });

// DELETE request
await client.delete('/users/123');
```

## Error Handling

All errors are structured with:

- `i18n`: Translation key
- `message`: Error message
- `code`: Optional error code
- `statusCode`: HTTP status code

```typescript
try {
  await client.post('/auth/login', credentials);
} catch (error) {
  const e = JSON.parse(error.message);
  console.log(e.i18n); // 'invalid_credentials'
  console.log(e.statusCode); // 401
}
```
