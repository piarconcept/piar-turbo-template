import { clsx } from 'clsx';

export function JsonEditorField({
  value,
  onChange,
  disabled,
  rows,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      value={value == null ? '' : String(value)}
      onChange={(e) => onChange(e.target.value)}
      rows={rows ?? 6}
      disabled={disabled}
      className={clsx(
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm',
        disabled ? 'bg-gray-100 text-gray-500' : '',
      )}
    />
  );
}
