'use client';

import * as React from 'react';
import { clsx } from 'clsx';
import {
  FieldType,
  type EntityFieldsConfig,
  type FieldConfig,
  type ValidationRule,
} from '@piar/domain-fields';
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

function normalizeForComparison(value: unknown): unknown {
  if (value == null) return value;
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(normalizeForComparison);
  if (typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const normalized: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    normalized[key] = normalizeForComparison(record[key]);
  }
  return normalized;
}

function serializeForComparison(values: DynamicFormValues): string {
  try {
    return JSON.stringify(normalizeForComparison(values));
  } catch {
    return '';
  }
}

function isValueEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function getRuleMessage(
  t: ((key: string) => string) | undefined,
  message: string | undefined,
  fallback: string,
) {
  if (!message) return fallback;
  return translateWithFallback(t, message, message);
}

function validateRule(
  rule: ValidationRule,
  value: unknown,
  context: DynamicFormValues,
  t?: (key: string) => string,
): string | undefined {
  if (rule.pattern && typeof value === 'string') {
    rule.pattern.lastIndex = 0;
    if (!rule.pattern.test(value)) {
      return getRuleMessage(t, rule.message, 'Invalid format');
    }
  }

  if (typeof rule.minLength === 'number') {
    const length = typeof value === 'string' || Array.isArray(value) ? value.length : undefined;
    if (typeof length === 'number' && length < rule.minLength) {
      return getRuleMessage(t, rule.message, `Minimum length is ${rule.minLength}`);
    }
  }

  if (typeof rule.maxLength === 'number') {
    const length = typeof value === 'string' || Array.isArray(value) ? value.length : undefined;
    if (typeof length === 'number' && length > rule.maxLength) {
      return getRuleMessage(t, rule.message, `Maximum length is ${rule.maxLength}`);
    }
  }

  if (typeof rule.min === 'number') {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric) && numeric < rule.min) {
      return getRuleMessage(t, rule.message, `Minimum value is ${rule.min}`);
    }
  }

  if (typeof rule.max === 'number') {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(numeric) && numeric > rule.max) {
      return getRuleMessage(t, rule.message, `Maximum value is ${rule.max}`);
    }
  }

  if (rule.custom && !rule.custom(value, context)) {
    return getRuleMessage(t, rule.message, 'Invalid value');
  }

  return undefined;
}

function validateField(
  field: FieldConfig,
  values: DynamicFormValues,
  mode: DynamicFormMode,
  t?: (k: string) => string,
): string | undefined {
  if (!shouldRenderField(field, mode, values)) return undefined;

  const key = String(field.key);
  const value = values[key];
  const isReadonlyField =
    field.editable === false ||
    field.disabled === true ||
    (mode !== 'create' && BASE_METADATA_KEYS.has(key));
  if (isReadonlyField) return undefined;

  if (field.required && isValueEmpty(value)) {
    return translateWithFallback(t, 'validation.required', 'Required');
  }

  if (isValueEmpty(value)) return undefined;

  if (field.type === FieldType.Email && typeof value === 'string') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return translateWithFallback(t, 'validation.email', 'Invalid email');
    }
  }

  if (field.type === FieldType.URL && typeof value === 'string') {
    try {
      const parsed = new URL(value);
      if (!parsed.protocol.startsWith('http')) {
        return translateWithFallback(t, 'validation.url', 'Invalid URL');
      }
    } catch {
      return translateWithFallback(t, 'validation.url', 'Invalid URL');
    }
  }

  if (field.type === FieldType.Phone && typeof value === 'string') {
    const phonePattern = /^[+\d().\-\s]{7,20}$/;
    if (!phonePattern.test(value)) {
      return translateWithFallback(t, 'validation.phone', 'Invalid phone number');
    }
  }

  if (field.type === FieldType.Number) {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) {
      return translateWithFallback(t, 'validation.number', 'Invalid number');
    }
  }

  if (field.type === FieldType.Date) {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
      return translateWithFallback(t, 'validation.date', 'Invalid date');
    }
  }

  const rules = Array.isArray(field.validation)
    ? field.validation
    : field.validation
      ? [field.validation]
      : [];

  for (const rule of rules) {
    const error = validateRule(rule, value, values, t);
    if (error) return error;
  }

  return undefined;
}

function validateForm(
  config: EntityFieldsConfig,
  values: DynamicFormValues,
  mode: DynamicFormMode,
  t?: (k: string) => string,
) {
  const errors: Record<string, string> = {};

  for (const field of config.fields as Array<FieldConfig>) {
    const key = String(field.key);
    const error = validateField(field, values, mode, t);
    if (error) errors[key] = error;
  }

  return errors;
}

export function DynamicForm<TEntity>({
  config,
  values: valuesProp,
  mode = 'create',
  onSubmit,
  t,
  warnOnUnsavedChanges = true,
  autosave,
  className,
}: DynamicFormProps<TEntity>) {
  const initialValues = React.useMemo(
    () =>
      getInitialValues(
        config as EntityFieldsConfig,
        (valuesProp as DynamicFormValues) ?? undefined,
      ),
    [config, valuesProp],
  );
  const [values, setValues] = React.useState<DynamicFormValues>(() => initialValues);

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = React.useState<string | null>(null);
  const baselineSerializedRef = React.useRef<string>(serializeForComparison(initialValues));
  const currentSerialized = React.useMemo(() => serializeForComparison(values), [values]);
  const isDirty = currentSerialized !== baselineSerializedRef.current;
  const leavePrompt = translateWithFallback(
    t,
    'common.general.unsavedChanges',
    'You have unsaved changes. Leave without saving?',
  );
  const autosaveEnabled = Boolean(autosave?.enabled && autosave.storageKey);
  const autosaveStorageKey = autosave?.storageKey ?? '';
  const autosaveDebounceMs = autosave?.debounceMs ?? 800;
  const restoreDraftOnMount = autosave?.restoreDraftOnMount ?? true;
  const fieldsByKey = React.useMemo(() => {
    const map = new Map<string, FieldConfig<TEntity, unknown>>();
    for (const field of config.fields as Array<FieldConfig<TEntity, unknown>>) {
      map.set(String(field.key), field);
    }
    return map;
  }, [config.fields]);

  React.useEffect(() => {
    setValues(initialValues);
    baselineSerializedRef.current = serializeForComparison(initialValues);
    setErrors({});
    setSuccessMessage(null);
    setLastDraftSavedAt(null);
  }, [initialValues]);

  React.useEffect(() => {
    if (!autosaveEnabled || !restoreDraftOnMount) return;
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem(autosaveStorageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      setValues((current) => ({ ...current, ...(parsed as DynamicFormValues) }));
    } catch {
      // Ignore invalid draft payloads
    }
  }, [autosaveEnabled, autosaveStorageKey, restoreDraftOnMount]);

  React.useEffect(() => {
    if (!autosaveEnabled || !isDirty || isSubmitting) return;
    if (typeof window === 'undefined') return;

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(autosaveStorageKey, JSON.stringify(values));
        setLastDraftSavedAt(new Date().toISOString());
      } catch {
        // Ignore quota/security failures
      }
    }, autosaveDebounceMs);

    return () => window.clearTimeout(timeout);
  }, [autosaveEnabled, autosaveStorageKey, autosaveDebounceMs, isDirty, isSubmitting, values]);

  React.useEffect(() => {
    if (!warnOnUnsavedChanges || !isDirty || isSubmitting) return;
    if (typeof window === 'undefined') return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = leavePrompt;
      return leavePrompt;
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [warnOnUnsavedChanges, isDirty, isSubmitting, leavePrompt]);

  React.useEffect(() => {
    if (!warnOnUnsavedChanges || !isDirty || isSubmitting) return;
    if (typeof document === 'undefined') return;

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.getAttribute('target') && anchor.getAttribute('target') !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(anchor.href, window.location.href);
      const isSameUrl = targetUrl.href === currentUrl.href;
      if (isSameUrl) return;

      const shouldLeave = window.confirm(leavePrompt);
      if (!shouldLeave) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('click', onDocumentClick, true);
    return () => document.removeEventListener('click', onDocumentClick, true);
  }, [warnOnUnsavedChanges, isDirty, isSubmitting, leavePrompt]);

  const setValue = (key: string, next: unknown) => {
    setValues((prev: DynamicFormValues) => {
      const nextValues = { ...prev, [key]: next };

      setErrors((currentErrors) => {
        const field = fieldsByKey.get(key);
        if (!field) return currentErrors;
        if (!(key in currentErrors)) return currentErrors;

        const fieldError = validateField(field as FieldConfig, nextValues, mode, t);
        if (fieldError) {
          if (currentErrors[key] === fieldError) return currentErrors;
          return { ...currentErrors, [key]: fieldError };
        }

        const { [key]: _, ...rest } = currentErrors;
        return rest;
      });

      return nextValues;
    });
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSuccessMessage(null);

    const nextErrors = validateForm(config as EntityFieldsConfig, values, mode, t);
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
      baselineSerializedRef.current = serializeForComparison(values);
      if (autosaveEnabled && typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(autosaveStorageKey);
          setLastDraftSavedAt(null);
        } catch {
          // Ignore storage failures
        }
      }
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

      {autosaveEnabled && lastDraftSavedAt ? (
        <Text as="p" variant="caption" className="text-gray-500">
          {translateWithFallback(t, 'common.status.draftSaved', 'Draft saved')}:{' '}
          {new Date(lastDraftSavedAt).toLocaleTimeString()}
        </Text>
      ) : null}

      {isDirty ? (
        <Text as="p" variant="caption" className="text-amber-700">
          {translateWithFallback(t, 'common.general.unsavedChanges', 'You have unsaved changes')}
        </Text>
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
