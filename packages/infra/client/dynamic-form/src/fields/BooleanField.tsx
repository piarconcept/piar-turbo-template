import { Checkbox } from '@piar/ui-components';

export function BooleanField({
  value,
  onChange,
  disabled,
}: {
  value: unknown;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Checkbox
      checked={Boolean(value)}
      onChange={(e) => onChange(e.currentTarget.checked)}
      disabled={disabled}
    />
  );
}
