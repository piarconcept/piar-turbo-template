'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import type { SupportedLanguage } from '@piar/messages';
import { User } from 'lucide-react';
import { Container, Text } from '@piar/ui-components';
import { accountEntityFieldsConfig } from '@piar/domain-fields';
import { DynamicTable, type FilterDefinition } from '@piar/infra-client-dynamic-form';
import { useDynamicTableResource } from '@/hooks/useDynamicTableResource';
import { useBackofficeTranslations } from '@/lib/backofficeTranslations';

export default function AccountsPage() {
  const { data: session, status } = useSession();

  const locale = useLocale() as SupportedLanguage;
  const { t, tCommon, tDashboard } = useBackofficeTranslations();

  const { query, onQueryChange, rows, total, loading, error } = useDynamicTableResource({
    path: '/accounts',
    accessToken: session?.accessToken,
    initialQuery: {
      page: 1,
      limit: 10,
      filters: {},
      sort: { key: 'accountCode', direction: 'asc' },
    },
  });

  const filters: FilterDefinition[] = [
    {
      key: 'role',
      label: 'fields.account.role.label',
      type: 'select',
      options: [
        { value: 'admin', label: t('options.account.role.admin.label') },
        { value: 'user', label: t('options.account.role.user.label') },
      ],
    },
  ];

  const normalizedRows = rows.map((row) => {
    const roleValue = row.role as string | undefined;
    return {
      ...row,
      role: roleValue ? t(`options.account.role.${roleValue}.label`) : row.role,
    };
  });

  return (
    <Container className="py-8 px-0" padding="none">
      <div className="mb-4 flex items-center gap-3">
        <User className="h-8 w-8 text-[var(--color-secondary)]" />
        <Text as="h1" variant="h2">
          {tDashboard('nav.accounts')}
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
        config={accountEntityFieldsConfig}
        locale={locale}
        columns={[
          { key: 'accountCode', label: 'fields.account.accountCode.label' },
          { key: 'email', label: 'fields.account.email.label' },
          { key: 'role', label: 'fields.account.role.label' },
          { key: 'updatedAt', label: 'fields.base.updatedAt.label' },
        ]}
        rows={normalizedRows}
        total={total}
        query={query}
        loading={loading || status === 'loading'}
        searchKeys={['accountCode', 'email']}
        filters={filters}
        t={t}
        onQueryChange={onQueryChange}
        rowActions={(row) => [{ label: tCommon('actions.edit'), href: `/accounts/${row.id}` }]}
      />
    </Container>
  );
}
