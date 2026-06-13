import type { ReactNode } from 'react';

import { cn } from '@/shared/lib';

type PanelProps = {
  children: ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cn(
        'flex min-h-0 w-full flex-col overflow-hidden rounded-md bg-white shadow-panel',
        className,
      )}
    >
      {children}
    </section>
  );
}
