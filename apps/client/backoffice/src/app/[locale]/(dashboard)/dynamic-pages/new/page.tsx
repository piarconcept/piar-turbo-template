'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Text } from '@piar/ui-components';
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { dynamicPageEntityFieldsConfig } from '@piar/domain-fields';
import { useDynamicFormResource } from '@/hooks/useDynamicFormResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export default function NewDynamicPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();
  const { create } = useDynamicFormResource({
    path: '/dynamic-pages',
    accessToken: session?.accessToken,
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
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
            {`${tCommon('actions.create')} ${tDashboard('nav.dynamicPages')}`}
          </Text>
        </div>
      </div>

      <DynamicForm
        mode="create"
        config={dynamicPageEntityFieldsConfig}
        t={t}
        onSubmit={async (values) => {
          const created = await create(values);
          if (created) router.push(`/${locale}/dynamic-pages`);
        }}
      />
    </Container>
  );
}
