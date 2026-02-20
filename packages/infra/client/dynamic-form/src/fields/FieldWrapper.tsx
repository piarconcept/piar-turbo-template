import * as React from 'react';
import { Text } from '@piar/ui-components';
import { clsx } from 'clsx';

export function FieldWrapper({
  id,
  label,
  description,
  required,
  error,
  helpText,
  className,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('space-y-1', className)}>
      <label htmlFor={id} className="block">
        <Text as="span" variant="bodySmall" className="font-medium text-gray-900">
          {label}
          {required ? <span className="text-red-600"> *</span> : null}
        </Text>
      </label>
      {description ? (
        <Text as="p" variant="bodySmall" className="text-gray-600">
          {description}
        </Text>
      ) : null}
      {children}
      {helpText ? (
        <Text as="p" variant="bodySmall" className="text-gray-500">
          {helpText}
        </Text>
      ) : null}
      {error ? (
        <Text as="p" variant="bodySmall" className="text-red-700">
          {error}
        </Text>
      ) : null}
    </div>
  );
}
