import { AppFrame, Panel, PanelHeader } from '@/shared/ui';

export function ChatWidget() {
  return (
    <AppFrame>
      <Panel aria-label="Doodle Chat">
        <PanelHeader eyebrow="Doodle" title="Team chat" />
      </Panel>
    </AppFrame>
  );
}
