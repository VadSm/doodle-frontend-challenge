import { useVirtualizer } from '@tanstack/react-virtual';
import type { RefObject } from 'react';

import { MessageBubble, type TMessage } from '@/entities/message';

type TVirtualizedMessagesListProps = {
  messages: TMessage[];
  scrollRef: RefObject<HTMLDivElement | null>;
};

const ESTIMATED_MESSAGE_HEIGHT = 132;

export function VirtualizedMessagesList({
  messages,
  scrollRef,
}: TVirtualizedMessagesListProps) {
  const rowVirtualizer = useVirtualizer({
    count: messages.length,
    estimateSize: () => ESTIMATED_MESSAGE_HEIGHT,
    getItemKey: (index) => messages[index]._id,
    getScrollElement: () => scrollRef.current,
    overscan: 8,
  });

  return (
    <div
      className="relative w-full"
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const message = messages[virtualRow.index];

        return (
          <div
            className="absolute left-0 top-0 w-full pb-4"
            data-index={virtualRow.index}
            key={virtualRow.key}
            ref={rowVirtualizer.measureElement}
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <MessageBubble message={message} />
          </div>
        );
      })}
    </div>
  );
}
