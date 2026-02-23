import { clsx } from 'clsx';
import * as React from 'react';

function toEditorText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

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
  const [text, setText] = React.useState(() => toEditorText(value));

  React.useEffect(() => {
    setText(toEditorText(value));
  }, [value]);

  const handleChange = (nextText: string) => {
    setText(nextText);
    const trimmed = nextText.trim();
    if (!trimmed) {
      onChange('');
      return;
    }
    try {
      onChange(JSON.parse(nextText));
    } catch {
      onChange(nextText);
    }
  };

  return (
    <textarea
      value={text}
      onChange={(e) => handleChange(e.target.value)}
      rows={rows ?? 6}
      disabled={disabled}
      className={clsx(
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 font-mono text-sm',
        disabled ? 'bg-gray-100 text-gray-500' : '',
      )}
    />
  );
}
