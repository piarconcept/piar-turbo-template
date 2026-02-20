import { Input } from '@piar/ui-components';
import { formatDateInputValue } from './utils';

export function DateField({
  id,
  value,
  onChange,
  error,
  disabled,
}: {
  id: string;
  value: unknown;
  onChange: (next: unknown) => void;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <Input
      id={id}
      type="date"
      value={formatDateInputValue(value)}
      onChange={(e) => onChange(e.target.value)}
      variant={error ? 'error' : 'default'}
      disabled={disabled}
    />
  );
}
