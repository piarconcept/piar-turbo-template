'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import { type EntityFieldsConfig, type FieldConfig } from '@piar/domain-fields';
import { Button, Text } from '@piar/ui-components';
import type { DynamicFormMode, DynamicFormProps, DynamicFormValues } from './types';
import { ApplicationError } from '@piar/domain-models';
import { FieldRenderer } from './fields/FieldRenderer';
import { translateWithFallback } from './fields/utils';

function getInitialValues<TEntity>(
  config: EntityFieldsConfig<TEntity>,
  initial?: DynamicFormValues,
) {
  const values: DynamicFormValues = { ...(initial ?? {}) };

  for (const field of config.fields as Array<FieldConfig<TEntity, unknown>>) {
    const k = String(field.key);
    if (values[k] === undefined && field.defaultValue !== undefined) values[k] = field.defaultValue;
  }

  return values;
}

const BASE_METADATA_KEYS = new Set(['id', 'createdAt', 'updatedAt']);

function shouldRenderField(field: FieldConfig, mode: DynamicFormMode, values: DynamicFormValues) {
  if (mode === 'create' && BASE_METADATA_KEYS.has(String(field.key))) return false;
  if (field.visible === false) return false;

  if (field.dependsOn && Array.isArray(field.dependsOn)) {
    const deps = field.dependsOn as Array<
      string | { field: string; condition?: (value: unknown) => boolean }
    >;

    const satisfied = deps.every((dep) => {
      if (typeof dep === 'string') return Boolean(values[dep]);
      const value = values[dep.field];
      return dep.condition ? dep.condition(value) : Boolean(value);
    });

    if (!satisfied) return false;
  }

  return true;
}

function validateRequired(
  config: EntityFieldsConfig,
  values: DynamicFormValues,
  mode: DynamicFormMode,
  t?: (k: string) => string,
) {
  const errors: Record<string, string> = {};

  for (const field of config.fields as Array<FieldConfig>) {
    if (!shouldRenderField(field, mode, values)) continue;

    const k = String(field.key);
    if (!field.required) continue;

    // If the field is not editable (or explicitly disabled), don't validate it.
    const disabled = field.editable === false || field.disabled === true;
    if (disabled) continue;

    const v = values[k];
    const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
    if (empty) errors[k] = t ? t('validation.required') : 'Required';
  }

  return errors;
}

export function DynamicForm<TEntity>({
  config,
  values: valuesProp,
  mode = 'create',
  onSubmit,
  t,
  className,
}: DynamicFormProps<TEntity>) {
  const [values, setValues] = React.useState<DynamicFormValues>(() =>
    getInitialValues(config as EntityFieldsConfig, (valuesProp as DynamicFormValues) ?? undefined),
  );

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setValues(
      getInitialValues(
        config as EntityFieldsConfig,
        (valuesProp as DynamicFormValues) ?? undefined,
      ),
    );
    setErrors({});
    setSuccessMessage(null);
  }, [config, valuesProp]);

  const setValue = (key: string, next: unknown) => {
    setValues((prev: DynamicFormValues) => ({ ...prev, [key]: next }));
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSuccessMessage(null);

    const nextErrors = validateRequired(config as EntityFieldsConfig, values, mode, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!onSubmit) {
      setErrors({ form: 'Submission handler is not defined' });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setErrors({});
      setSuccessMessage(translateWithFallback(t, 'common.status.success', 'Saved successfully'));
    } catch (e) {
      if (e instanceof ApplicationError) {
        setErrors({ form: t && e.i18nKey ? t(e.i18nKey) : e.message || 'An error occurred' });
      } else if (e instanceof Error) {
        setErrors({ form: e.message || 'An unexpected error occurred' });
      } else {
        setErrors({ form: 'An unexpected error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={clsx('space-y-6', className)}>
      {config.groups?.length ? (
        <div className="space-y-8">
          {config.groups
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((group) => {
              const fieldKeys = group.fields
                .map(String)
                .filter((k) => !(mode === 'create' && BASE_METADATA_KEYS.has(k)));

              if (fieldKeys.length === 0) return null;

              return (
                <section key={group.id} className="rounded-2xl border border-gray-200 bg-white p-6">
                  <Text as="h2" variant="h4" className="text-[var(--color-secondary)]">
                    {t ? t(group.label) : group.label}
                  </Text>
                  {group.description && (
                    <Text as="p" variant="bodySmall" className="mt-2 text-gray-600">
                      {t ? t(group.description) : group.description}
                    </Text>
                  )}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {fieldKeys.map((fieldKey) => {
                      const field = config.fields.find((f) => String(f.key) === String(fieldKey));
                      if (!field) return null;
                      if (!shouldRenderField(field as FieldConfig, mode, values)) return null;

                      const disabled =
                        mode !== 'create' &&
                        (BASE_METADATA_KEYS.has(String(field.key)) || field.editable === false);

                      return (
                        <FieldRenderer
                          key={String(field.key)}
                          field={field as FieldConfig<TEntity, unknown>}
                          value={values[String(field.key)]}
                          error={errors[String(field.key)]}
                          setValue={(next) => setValue(String(field.key), next)}
                          t={t}
                          disabled={disabled}
                          values={values}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {config.fields
            .filter((f) => shouldRenderField(f as FieldConfig, mode, values))
            .map((field) => {
              const disabled =
                mode !== 'create' &&
                (BASE_METADATA_KEYS.has(String(field.key)) || field.editable === false);

              return (
                <FieldRenderer
                  key={String(field.key)}
                  field={field as FieldConfig<TEntity, unknown>}
                  value={values[String(field.key)]}
                  error={errors[String(field.key)]}
                  setValue={(next) => setValue(String(field.key), next)}
                  t={t}
                  disabled={disabled}
                  values={values}
                />
              );
            })}
        </div>
      )}

      {errors.form ? (
        <div className="rounded-md bg-red-50 p-4">
          <Text variant="bodySmall" className="text-red-700">
            {errors.form}
          </Text>
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-md bg-green-50 p-4" role="status" aria-live="polite">
          <Text variant="bodySmall" className="text-green-700">
            {successMessage}
          </Text>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
          {isSubmitting
            ? translateWithFallback(t, 'common.status.loading', 'Saving...')
            : translateWithFallback(t, 'common.actions.save', 'Save')}
        </Button>
      </div>
    </form>
  );
}
