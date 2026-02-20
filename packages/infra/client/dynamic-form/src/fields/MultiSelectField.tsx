import * as React from 'react';
import type { FieldOption } from '@piar/domain-fields';
import { clsx } from 'clsx';
import { normalizeOptions } from './utils';

export function MultiSelectField({
  value,
  onChange,
  options,
  disabled,
  t,
  context,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  options?:
    | FieldOption[]
    | ((context: Record<string, unknown>) => FieldOption[] | Promise<FieldOption[]>);
  disabled?: boolean;
  t?: (key: string) => string;
  context: Record<string, unknown>;
}) {
  const [resolved, setResolved] = React.useState<FieldOption[]>([]);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const next = typeof options === 'function' ? await options(context) : (options ?? []);
      if (active) setResolved(next);
    })();
    return () => {
      active = false;
    };
  }, [options, context]);

  const normalized = normalizeOptions(resolved, t);

  const selected = new Set(Array.isArray(value) ? value.map(String) : []);

  return (
    <select
      multiple
      value={[...selected]}
      onChange={(e) => {
        const next = Array.from(e.target.selectedOptions).map((o) => o.value);
        onChange(next);
      }}
      disabled={disabled}
      className={clsx(
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        disabled ? 'bg-gray-100 text-gray-500' : '',
      )}
    >
      {normalized.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
