import { clsx } from 'clsx';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

export type AsyncStateVariant = 'loading' | 'empty' | 'error';

export interface AsyncStateProps {
  variant: AsyncStateVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

function LoadingGlyph() {
  return (
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-[var(--color-primary)]"
      aria-hidden="true"
    />
  );
}

function EmptyGlyph() {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
      aria-hidden="true"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
    </div>
  );
}

function ErrorGlyph() {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
      aria-hidden="true"
    >
      <span className="text-lg font-semibold leading-none text-red-700">!</span>
    </div>
  );
}

function StateGlyph({ variant }: { variant: AsyncStateVariant }) {
  if (variant === 'loading') return <LoadingGlyph />;
  if (variant === 'error') return <ErrorGlyph />;
  return <EmptyGlyph />;
}

export function AsyncState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: AsyncStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-8 text-center',
        className,
      )}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <StateGlyph variant={variant} />
      <Text as="p" variant="h6" className="text-gray-800">
        {title}
      </Text>
      {description ? (
        <Text as="p" variant="bodySmall" className="max-w-xl text-gray-600">
          {description}
        </Text>
      ) : null}
      {onAction && actionLabel ? (
        <Button
          type="button"
          variant={variant === 'error' ? 'outline' : 'primary'}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
