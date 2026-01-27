'use client';

import { ErrorPage } from '@piar/infra-client-common-error';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPage onRetry={reset} />;
}
