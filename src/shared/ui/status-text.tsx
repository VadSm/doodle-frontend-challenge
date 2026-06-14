import type { ReactNode } from 'react';

type TStatusTextProps = {
  children: ReactNode;
};

export function StatusText({ children }: TStatusTextProps) {
  return (
    <p className="py-4 text-center text-sm text-slate-500" role="status">
      {children}
    </p>
  );
}
