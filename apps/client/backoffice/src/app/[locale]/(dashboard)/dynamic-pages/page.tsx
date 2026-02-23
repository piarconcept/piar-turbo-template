'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import type { SupportedLanguage } from '@piar/messages';
import { FileText } from 'lucide-react';
import { Container, Text } from '@piar/ui-components';
import { dynamicPageEntityFieldsConfig } from '@piar/domain-fields';
import { DynamicTable, type FilterDefinition } from '@piar/infra-client-dynamic-form';
import { useDynamicTableResource } from '@/hooks/useDynamicTableResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export default function DynamicPagesPage() {
  const { data: session, status } = useSession();

  const locale = useLocale() as SupportedLanguage;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();

  const { query, onQueryChange, rows, total, loading, error } = useDynamicTableResource({
    path: '/dynamic-pages',
    accessToken: session?.accessToken,
    initialQuery: {
      page: 1,
      limit: 10,
      filters: {},
      sort: { key: 'pageCode', direction: 'asc' },
    },
  });

  const filters: FilterDefinition[] = [
    {
      key: 'status',
      label: 'fields.dynamicPage.status.label',
      type: 'select',
      operator: 'equals',
      options: [
        { value: 'draft', label: 'options.dynamicPage.status.draft.label' },
        { value: 'published', label: 'options.dynamicPage.status.published.label' },
        { value: 'archived', label: 'options.dynamicPage.status.archived.label' },
      ],
    },
    {
      key: 'isActive',
      label: 'fields.dynamicPage.isActive.label',
      type: 'boolean',
    },
    {
      key: 'showOnPublicWeb',
      label: 'fields.dynamicPage.showOnPublicWeb.label',
      type: 'boolean',
    },
  ];

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-4 flex items-center gap-3">
        <FileText className="h-8 w-8 text-[var(--color-secondary)]" />
        <Text as="h1" variant="h2">
          {tDashboard('nav.dynamicPages')}
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
        config={dynamicPageEntityFieldsConfig}
        locale={locale}
        columns={[
          { key: 'pageCode' },
          { key: 'slug' },
          { key: 'id' },
          { key: 'status' },
          { key: 'isActive', valueType: 'boolean' },
        ]}
        rows={rows}
        total={total}
        query={query}
        searchKeys={['pageCode', 'slug']}
        filters={filters}
        loading={loading || status === 'loading'}
        t={t}
        onQueryChange={onQueryChange}
        newButton={{ label: tCommon('actions.create'), href: '/dynamic-pages/new' }}
        rowActions={(row) => [{ label: tCommon('actions.edit'), href: `/dynamic-pages/${row.id}` }]}
      />
    </Container>
  );
}
