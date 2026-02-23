'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { Mail } from 'lucide-react';
import type { SupportedLanguage } from '@piar/messages';
import { Container, Text } from '@piar/ui-components';
import { contactSubmissionEntityFieldsConfig } from '@piar/domain-fields';
import { DynamicTable, type FilterDefinition } from '@piar/infra-client-dynamic-form';
import { useDynamicTableResource } from '@/hooks/useDynamicTableResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export default function ContactSubmissionsPage() {
  const { data: session, status } = useSession();

  const locale = useLocale() as SupportedLanguage;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();

  const { query, onQueryChange, rows, total, loading, error } = useDynamicTableResource({
    path: '/contact-submissions',
    accessToken: session?.accessToken,
    initialQuery: {
      page: 1,
      limit: 10,
      filters: {},
      sort: { key: 'createdAt', direction: 'desc' },
    },
  });

  const filters: FilterDefinition[] = [
    {
      key: 'status',
      label: 'fields.contactSubmission.status.label',
      type: 'select',
      options: [
        { value: 'new', label: t('options.contactSubmission.status.new.label') },
        { value: 'archived', label: t('options.contactSubmission.status.archived.label') },
      ],
    },
  ];

  const normalizedRows = rows.map((row) => {
    const statusValue = row.status as string | undefined;
    return {
      ...row,
      status: statusValue ? t(`options.contactSubmission.status.${statusValue}.label`) : row.status,
    };
  });

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-4 flex items-center gap-3">
        <Mail className="h-8 w-8 text-[var(--color-secondary)]" />
        <Text as="h1" variant="h2">
          {tDashboard('nav.contactSubmissions')}
        </Text>
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

      <DynamicTable
        config={contactSubmissionEntityFieldsConfig}
        locale={locale}
        columns={[{ key: 'name' }, { key: 'email' }, { key: 'status' }, { key: 'createdAt' }]}
        rows={normalizedRows}
        total={total}
        query={query}
        searchKeys={['name', 'email']}
        filters={filters}
        loading={loading || status === 'loading'}
        t={t}
        onQueryChange={onQueryChange}
        rowActions={(row) => [
          {
            label: tCommon('actions.view'),
            href: `/contact-submissions/${row.id}`,
          },
        ]}
      />
    </Container>
  );
}
