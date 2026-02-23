'use client';

import { clsx } from 'clsx';
import { Button } from './Button';

export interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, total, limit, onPageChange, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className={clsx('flex items-center justify-between gap-3', className)}>
      <div className="text-xs text-gray-500">
        Page <span className="font-semibold text-gray-700">{page}</span> of{' '}
        <span className="font-semibold text-gray-700">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
