import type { ChangeEvent } from 'react';
import { Input } from '@piar/ui-components';
import { parseNumberValue, toString } from './utils';

export function InputField({
  id,
  value,
  onChange,
  placeholder,
  error,
  disabled,
  type = 'text',
}: {
  id: string;
  value: unknown;
  onChange: (next: unknown) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  type?: string;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (type === 'number') {
      onChange(parseNumberValue(raw));
      return;
    }
    onChange(raw);
  };

  return (
    <Input
      id={id}
      placeholder={placeholder}
      value={toString(value)}
      onChange={handleChange}
      variant={error ? 'error' : 'default'}
      type={type}
      disabled={disabled}
    />
  );
}
