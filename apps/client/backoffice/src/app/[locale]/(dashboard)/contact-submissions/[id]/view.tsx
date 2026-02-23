'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { ContactSubmissionEntityProps } from '@piar/domain-models';
import { contactSubmissionEntityFieldsConfig } from '@piar/domain-fields';
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { Button, Container, Text } from '@piar/ui-components';
import { useDynamicFormResource } from '@/hooks/useDynamicFormResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export function ContactSubmissionDetailView({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();

  const { entity, update, remove, error } = useDynamicFormResource<ContactSubmissionEntityProps>({
    path: '/contact-submissions',
    accessToken: session?.accessToken,
    id,
  });

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--color-primary)]" />
          <p className="mt-4 text-gray-600">{tCommon('status.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Text as="h1" variant="h2">
            {`${tCommon('actions.view')} ${tDashboard('nav.contactSubmissions')}`}
          </Text>
          <Text as="p" variant="bodySmall" className="mt-2 text-gray-600">
            ID: {id}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/${locale}/contact-submissions`}>{tCommon('actions.back')}</Link>
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              if (!window.confirm('This action cannot be undone.')) return;
              const deleted = await remove(id);
              if (deleted) {
                router.push(`/${locale}/contact-submissions`);
              }
            }}
          >
            {tCommon('actions.delete')}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {(() => {
            try {
              return tCommon(error.i18nKey ?? 'server_error');
            } catch {
              return error.message;
            }
          })()}
        </div>
      ) : null}

      {!entity ? (
        <Text as="p" variant="bodySmall" className="text-gray-600">
          {tCommon('general.notAvailable')}
        </Text>
      ) : (
        <DynamicForm
          mode="edit"
          config={contactSubmissionEntityFieldsConfig}
          values={entity}
          t={t}
          onSubmit={async (values) => {
            await update(id, values);
          }}
        />
      )}
    </Container>
  );
}
