import type { TextareaHTMLAttributes } from 'react';

import { cn } from '@/shared/lib';

type TTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...props }: TTextAreaProps) {
  return (
    <textarea
      className={cn(
        'min-h-11 w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-aqua focus:ring-2 focus:ring-aqua/25 disabled:cursor-not-allowed disabled:bg-slate-100',
        className,
      )}
      {...props}
    />
  );
}
