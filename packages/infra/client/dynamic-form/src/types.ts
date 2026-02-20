import type { EntityFieldsConfig } from '@piar/domain-fields';

export type DynamicFormMode = 'create' | 'edit' | 'view';

export type DynamicFormValues = Record<string, unknown>;

export interface DynamicFormProps<TEntity = unknown> {
  config: EntityFieldsConfig<TEntity>;
  values?: Partial<Record<keyof TEntity & string, unknown>> | DynamicFormValues;
  mode?: DynamicFormMode;
  /** Called when the form is submitted and validation passes. */
  onSubmit?: (values: DynamicFormValues) => void | Promise<void>;
  /** Translate helper for labels/placeholders (optional). */
  t?: (key: string) => string;
  className?: string;
}
