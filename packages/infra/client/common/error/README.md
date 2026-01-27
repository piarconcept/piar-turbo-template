# @piar/infra-client-common-error

Next.js error handling infrastructure for client applications (logic + shared page templates).

## Features

- **Shared**: HTTP error deserializer, error formatter (works on both client and server)
- **Client**: React hooks for error handling, ErrorBoundary logic
- **Server**: Error data extraction for Server Components and Server Actions
- **Pages**: Error and Not Found page templates built with `@piar/ui-components`

**Note**: Page templates are provided here to standardize app-level errors.
For other UI components (alerts, toasts), use `@piar/ui-components`.

## Usage

### Shared (Isomorphic)

```typescript
import { deserializeHttpError, formatErrorMessage } from '@piar/infra-client-common-error/shared';

// Deserialize API error response
const error = deserializeHttpError(response);

// Format error message with i18n
const message = formatErrorMessage(error, t);
```

### Client-Side

```typescript
'use client';

import { useErrorHandler, ErrorBoundary } from '@piar/infra-client-common-error/client';
import { ErrorAlert } from '@piar/ui-components'; // UI component

function MyComponent() {
  const { handleError, error, clearError } = useErrorHandler();

  const onSubmit = async () => {
    try {
      await api.login();
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {error && <ErrorAlert error={error} onClose={clearError} />}
      <button onClick={onSubmit}>Login</button>
    </>
  );
}

// ErrorBoundary requires fallback prop
function App() {
  return (
    <ErrorBoundary fallback={(error, reset) => (
      <ErrorAlert error={error} onRetry={reset} />
    )}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Server-Side

```typescript
import { extractServerError, wrapServerAction } from '@piar/infra-client-common-error/server';
import { ErrorPage } from '@piar/ui-components'; // UI component

// Server Component
export default async function Page() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    const errorData = extractServerError(error);
    return <ErrorPage {...errorData} />;
  }
}

// Server Action
export const loginAction = wrapServerAction(async (formData) => {
  // Your logic here
  return { success: true };
});
```

### Page Templates

```tsx
import { ErrorPage, NotFoundPage } from '@piar/infra-client-common-error';

export default function NotFound() {
  return <NotFoundPage />;
}
```

## Development

```bash
# Build
pnpm --filter @piar/infra-client-common-error build

# Watch mode
pnpm --filter @piar/infra-client-common-error dev

# Test
pnpm --filter @piar/infra-client-common-error test
```
