import type { ReactNode } from 'react';

import backgroundUrl from './background.png';

type TAppFrameProps = {
  children: ReactNode;
};

export function AppFrame({ children }: TAppFrameProps) {
  return (
    <main
      className="flex min-h-dvh text-ink"
      style={{
        backgroundColor: '#f7f8f8',
        backgroundImage: `url(${backgroundUrl})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '768px 590px',
      }}
    >
      {children}
    </main>
  );
}
