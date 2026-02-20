import { FieldType, type FieldConfig } from '@piar/domain-fields';
import { FieldWrapper } from './FieldWrapper';
import { BooleanField } from './BooleanField';
import { TextField } from './TextField';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { MultiSelectField } from './MultiSelectField';
import { DateField } from './DateField';
import { JsonEditorField } from './JsonEditorField';
import { CheckboxField } from './CheckboxField';
import { RadioField } from './RadioField';
import { translate } from './utils';

export function FieldRenderer<TEntity>({
  field,
  value,
  setValue,
  error,
  disabled,
  t,
  values,
}: {
  field: FieldConfig<TEntity, unknown>;
  value: unknown;
  setValue: (next: unknown) => void;
  error?: string;
  disabled?: boolean;
  t?: (key: string) => string;
  values?: Record<string, unknown>;
}) {
  if (field.ui?.component === 'hidden') return null;

  const key = String(field.key);
  const label = translate(t, field.label);
  const description = translate(t, field.description);
  const placeholder = translate(t, field.ui?.placeholder);
  const helpText = translate(t, field.ui?.helpText);

  const computedDisabled = disabled || field.disabled === true || field.editable === false;

  const renderField = () => {
    switch (field.type) {
      case FieldType.Boolean:
        return (
          <BooleanField
            value={value}
            onChange={(next) => setValue(next)}
            disabled={computedDisabled}
          />
        );
      case FieldType.Text:
        return (
          <TextField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            rows={field.ui?.rows}
            error={error}
            disabled={computedDisabled}
          />
        );
      case FieldType.Select:
        return (
          <SelectField
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            options={field.options}
            disabled={computedDisabled}
            t={t}
            context={values ?? {}}
          />
        );
      case FieldType.MultiSelect:
        return (
          <MultiSelectField
            value={value}
            onChange={(next) => setValue(next)}
            options={field.options}
            disabled={computedDisabled}
            t={t}
            context={values ?? {}}
          />
        );
      case FieldType.Radio:
        return (
          <RadioField
            value={value}
            onChange={(next) => setValue(next)}
            options={field.options}
            disabled={computedDisabled}
            t={t}
            context={values ?? {}}
          />
        );
      case FieldType.Checkbox:
        return (
          <CheckboxField
            value={value}
            onChange={(next) => setValue(next)}
            disabled={computedDisabled}
            label={label}
            required={field.required}
          />
        );
      case FieldType.Date:
        return (
          <DateField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            error={error}
            disabled={computedDisabled}
          />
        );
      case FieldType.Number:
        return (
          <InputField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            error={error}
            disabled={computedDisabled}
            type="number"
          />
        );
      case FieldType.Email:
        return (
          <InputField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            error={error}
            disabled={computedDisabled}
            type="email"
          />
        );
      case FieldType.Phone:
        return (
          <InputField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            error={error}
            disabled={computedDisabled}
            type="tel"
          />
        );
      case FieldType.URL:
        return (
          <InputField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            error={error}
            disabled={computedDisabled}
            type="url"
          />
        );
      case FieldType.JSON:
        return (
          <JsonEditorField
            value={value}
            onChange={(next) => setValue(next)}
            disabled={computedDisabled}
            rows={field.ui?.rows}
          />
        );
      default:
        return (
          <InputField
            id={key}
            value={value}
            onChange={(next) => setValue(next)}
            placeholder={placeholder}
            error={error}
            disabled={computedDisabled}
            type="text"
          />
        );
    }
  };

  if (field.type === FieldType.Checkbox) return renderField();

  return (
    <FieldWrapper
      id={key}
      label={label}
      description={description}
      required={field.required}
      error={error}
      helpText={helpText}
      className={field.ui?.className}
    >
      {renderField()}
    </FieldWrapper>
  );
}
