import Link from 'next/link';
import { Button, Text } from '@piar/ui-components';

export interface NotFoundPageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function NotFoundPage({
  title = 'Page not found',
  description = "We couldn't find the page you were looking for.",
  actionLabel = 'Back to home',
  actionHref = '/',
}: NotFoundPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Text as="h1" variant="h3" className="mb-3 text-[var(--color-secondary)]">
          {title}
        </Text>
        <Text as="p" variant="body" className="text-gray-600">
          {description}
        </Text>

        <div className="mt-6">
          <Button asChild variant="primary">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
