import type { ReactNode } from 'react';

type TAppFrameProps = {
  children: ReactNode;
};

export function AppFrame({ children }: TAppFrameProps) {
  return (
    <main className="flex min-h-dvh bg-mist px-3 py-3 text-ink sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-5xl sm:min-h-[calc(100dvh-2.5rem)]">
        {children}
      </div>
    </main>
  );
}
