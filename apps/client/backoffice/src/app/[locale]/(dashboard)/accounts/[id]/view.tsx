'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Container, Text } from '@piar/ui-components';
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { accountEntityFieldsConfig } from '@piar/domain-fields';
import type { AccountEntityProps } from '@piar/domain-models';
import { useDynamicFormResource } from '@/hooks/useDynamicFormResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export function AccountEditView({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { t, tCommon } = useBackofficeTranslations();
  const { update, remove, entity } = useDynamicFormResource<AccountEntityProps>({
    path: '/accounts',
    accessToken: session?.accessToken,
    id,
  });

  const isCurrentAccount = session?.user?.id === id;

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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <Text as="h1" variant="h2">
            Edit account
          </Text>
          <Text as="p" variant="bodySmall" className="mt-2 text-gray-600">
            ID: {id}
          </Text>
        </div>
      </div>

      {isCurrentAccount ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This is your account. For safety, self-delete is disabled.
        </div>
      ) : null}

      <DynamicForm
        mode="edit"
        config={accountEntityFieldsConfig}
        values={entity ?? {}}
        t={t}
        onSubmit={async (values) => {
          await update(id, values);
        }}
      />

      {!isCurrentAccount ? (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={async () => {
              if (!confirm('Are you sure you want to delete this account?')) return;
              const deleted = await remove(id);
              if (!deleted) {
                throw new Error('Delete failed');
              }
              router.push(`/${locale}/accounts`);
            }}
          >
            {tCommon('actions.delete')}
          </Button>
        </div>
      ) : null}
    </Container>
  );
}
