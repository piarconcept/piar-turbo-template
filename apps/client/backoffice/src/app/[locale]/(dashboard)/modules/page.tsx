'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DynamicForm } from '@piar/infra-client-dynamic-form';
import { FieldType, type EntityFieldsConfig } from '@piar/domain-fields';

export default function ModulesPage() {
  const t = useTranslations('modules');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'ca';

  const exampleConfig: EntityFieldsConfig<{ name: string; isActive: boolean; tags: string[] }> = {
    entityName: 'example',
    fields: [
      {
        key: 'name',
        type: FieldType.Text,
        label: 'Name',
        required: true,
        ui: {
          placeholder: 'e.g. Example module',
        },
      },
      {
        key: 'isActive',
        type: FieldType.Boolean,
        label: 'Active',
        defaultValue: true,
      },
      {
        key: 'tags',
        type: FieldType.MultiSelect,
        label: 'Tags',
        options: [
          { value: 'ui', label: 'UI' },
          { value: 'forms', label: 'Forms' },
          { value: 'tables', label: 'Tables' },
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-[var(--color-secondary)]">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[var(--color-secondary)]">
            {t('dynamicForm')}
          </h2>
          <p className="mt-2 text-gray-600">{t('dynamicFormDescription')}</p>

          <div className="mt-6">
            <DynamicForm
              config={exampleConfig}
              mode="create"
              t={(k) => k}
              autosave={{ enabled: true, storageKey: 'dynamic-form:modules:example' }}
              onSubmit={async (values) => {
                // Example: no backend connected yet.
                // eslint-disable-next-line no-console
                console.log('DynamicForm submit', values);
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-[var(--color-secondary)]">
            {t('dynamicTable')}
          </h2>
          <p className="mt-2 text-gray-600">{t('dynamicTableDescription')}</p>

          <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-mono">
              GET /resource?page=1&amp;limit=10&amp;searchQuery=...&amp;filters=...
            </p>
          </div>

          <div className="mt-6">
            <Link
              href={`/${locale}/dashboard`}
              className="text-sm font-medium text-[var(--color-secondary)] hover:underline"
            >
              {t('backToDashboard')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
