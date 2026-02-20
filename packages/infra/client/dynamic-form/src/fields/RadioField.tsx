import * as React from 'react';
import type { FieldOption } from '@piar/domain-fields';
import { normalizeOptions } from './utils';

export function RadioField({
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
  const selected = value == null ? '' : String(value);

  return (
    <div className="space-y-2">
      {normalized.map((o) => (
        <label key={o.value} className="flex items-center gap-2 text-sm text-gray-900">
          <input
            type="radio"
            value={o.value}
            checked={selected === o.value}
            onChange={() => onChange(o.value)}
            disabled={disabled || o.disabled}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
