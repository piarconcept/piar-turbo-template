import { Checkbox } from '@piar/ui-components';

export function CheckboxField({
  value,
  onChange,
  disabled,
  label,
  required,
}: {
  value: unknown;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
  required?: boolean;
}) {
  const fullLabel = required ? `${label} *` : label;
  return (
    <Checkbox
      checked={Boolean(value)}
      onChange={(e) => onChange(e.currentTarget.checked)}
      disabled={disabled}
      label={fullLabel}
    />
  );
}
