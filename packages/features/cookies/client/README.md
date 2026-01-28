# @piar/cookies-client

Client-side cookie consent banner + preferences dialog.

## Usage

```tsx
import { CookieBanner } from '@piar/cookies-client';
import { Button } from '@piar/ui-components';
import Link from 'next/link';

<CookieBanner
  messages={messages.cookies}
  policyLink={
    <Button asChild size="inline" variant="ghost">
      <Link href="/legal/cookies">Cookies policy</Link>
    </Button>
  }
/>;
```

## Notes

- Stores consent in `localStorage` by default.
- The component is client-only.
- Provide translations via `messages` from `@piar/messages`.
