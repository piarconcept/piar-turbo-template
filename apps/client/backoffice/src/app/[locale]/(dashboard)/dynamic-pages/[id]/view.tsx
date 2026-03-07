'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { AsyncState, Button, Container, Text } from '@piar/ui-components';
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { dynamicPageEntityFieldsConfig } from '@piar/domain-fields';
import { useDynamicFormResource } from '@/hooks/useDynamicFormResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export function DynamicPageEditView({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();
  const { update, remove, entity, loading, error, findById } = useDynamicFormResource({
    path: '/dynamic-pages',
    accessToken: session?.accessToken,
    id,
  });

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh]">
        <AsyncState variant="loading" title={tCommon('status.loading')} className="min-h-[60vh]" />
      </div>
    );
  }

  const resolvedErrorMessage = (() => {
    if (!error) return null;
    try {
      return tCommon(error.i18nKey ?? 'server_error');
    } catch {
      return error.message;
    }
  })();

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Text as="h1" variant="h2">
            {`${tCommon('actions.edit')} ${tDashboard('nav.dynamicPages')}`}
          </Text>
          <Text as="p" variant="bodySmall" className="mt-2 text-gray-600">
            ID: {id}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              if (!window.confirm('This action cannot be undone.')) return;
              const deleted = await remove(id);
              if (deleted) {
                router.push(`/${locale}/dynamic-pages`);
              }
            }}
          >
            {tCommon('actions.delete')}
          </Button>
        </div>
      </div>

      {loading ? (
        <AsyncState variant="loading" title={tCommon('status.loading')} />
      ) : resolvedErrorMessage ? (
        <AsyncState
          variant="error"
          title={tCommon('status.error')}
          description={resolvedErrorMessage}
          actionLabel="Retry"
          onAction={() => {
            void findById();
          }}
        />
      ) : !entity ? (
        <AsyncState variant="empty" title={tCommon('general.notAvailable')} />
      ) : (
        <DynamicForm
          mode="edit"
          config={dynamicPageEntityFieldsConfig}
          values={entity}
          t={t}
          autosave={{ enabled: true, storageKey: `dynamic-form:dynamic-pages:edit:${id}` }}
          onSubmit={async (values) => {
            await update(id, values);
          }}
        />
      )}
    </Container>
  );
}
