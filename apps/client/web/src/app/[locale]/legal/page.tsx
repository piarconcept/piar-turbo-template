import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, Container, Text } from '@piar/ui-components';

export default async function LegalIndexPage() {
  const t = await getTranslations('legal');
  return (
    <Container className="py-12" width="7xl" padding="md">
      <Text as="h1" variant="h2" className="text-[var(--color-secondary)]">
        {t('index.title')}
      </Text>
      <Text as="p" variant="body" className="mt-3 text-gray-600">
        {t('index.description')}
      </Text>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/legal/privacy" className="flex flex-col items-start gap-2">
            <Text as="span" variant="label" className="text-[var(--color-secondary)]">
              {t('index.privacyLabel')}
            </Text>
            <Text as="span" variant="bodySmall" className="text-gray-600">
              {t('index.privacyDescription')}
            </Text>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/legal/terms" className="flex flex-col items-start gap-2">
            <Text as="span" variant="label" className="text-[var(--color-secondary)]">
              {t('index.termsLabel')}
            </Text>
            <Text as="span" variant="bodySmall" className="text-gray-600">
              {t('index.termsDescription')}
            </Text>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto justify-start p-4">
          <Link href="/legal/cookies" className="flex flex-col items-start gap-2">
            <Text as="span" variant="label" className="text-[var(--color-secondary)]">
              {t('index.cookiesLabel')}
            </Text>
            <Text as="span" variant="bodySmall" className="text-gray-600">
              {t('index.cookiesDescription')}
            </Text>
          </Link>
        </Button>
      </div>
    </Container>
  );
}
