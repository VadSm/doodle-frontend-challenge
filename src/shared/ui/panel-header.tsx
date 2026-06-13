import type { ReactNode } from 'react';

type PanelHeaderProps = {
  eyebrow: string;
  title: string;
  meta?: ReactNode;
};

export function PanelHeader({ eyebrow, meta, title }: PanelHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-aqua">{eyebrow}</p>
        <h1 className="truncate text-lg font-semibold text-ink sm:text-xl">
          {title}
        </h1>
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </header>
  );
}
