import { clsx } from 'clsx';

export function TextField({
  id,
  value,
  onChange,
  placeholder,
  rows,
  error,
  disabled,
}: {
  id: string;
  value: unknown;
  onChange: (next: unknown) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value == null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 4}
      disabled={disabled}
      className={clsx(
        'w-full rounded-md border px-3 py-2 text-sm',
        error ? 'border-red-400' : 'border-gray-300',
        disabled ? 'bg-gray-100 text-gray-500' : 'bg-white',
      )}
    />
  );
}
