import { useEffect, useRef } from 'react';

import type { TMessage } from '@/entities/message';
import { MessageBubble } from '@/entities/message/ui';

type TChatMessageListProps = {
  error: string | null;
  hasMoreOlder: boolean;
  isInitialLoading: boolean;
  isLoadingOlder: boolean;
  messages: TMessage[];
  onLoadOlder: () => void;
  onRetry: () => void;
};

const LOAD_OLDER_OFFSET = 120;

export function ChatMessageList({
  error,
  hasMoreOlder,
  isInitialLoading,
  isLoadingOlder,
  messages,
  onLoadOlder,
  onRetry,
}: TChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousFirstMessageIdRef = useRef<string | undefined>(undefined);
  const firstMessageId = messages.at(0)?._id;

  useEffect(() => {
    const element = scrollRef.current;
    const previousFirstMessageId = previousFirstMessageIdRef.current;
    const hasLoadedOlderMessages =
      previousFirstMessageId !== undefined &&
      firstMessageId !== previousFirstMessageId;

    if (element && messages.length > 0 && !hasLoadedOlderMessages) {
      element.scrollTop = element.scrollHeight;
    }

    previousFirstMessageIdRef.current = firstMessageId;
  }, [firstMessageId, messages.length]);

  const handleScroll = () => {
    if (
      scrollRef.current?.scrollTop !== undefined &&
      scrollRef.current.scrollTop < LOAD_OLDER_OFFSET &&
      hasMoreOlder &&
      !isLoadingOlder &&
      !isInitialLoading
    ) {
      onLoadOlder();
    }
  };

  return (
    <div
      aria-label="Message history"
      className="min-h-0 flex-1 overflow-y-auto px-4 py-5"
      onScroll={handleScroll}
      ref={scrollRef}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-4">
        {isInitialLoading ? (
          <p className="text-center text-sm text-slate-500" role="status">
            Loading messages...
          </p>
        ) : null}

        {error && messages.length === 0 ? (
          <div className="rounded-md border border-red-200 bg-white/90 p-4 text-center shadow-sm">
            <p className="mb-3 text-sm text-red-700" role="alert">
              {error}
            </p>
            <button
              className="text-sm font-semibold text-aqua underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-aqua"
              onClick={onRetry}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}

        {isLoadingOlder ? (
          <p className="text-center text-sm text-slate-500" role="status">
            Loading older messages...
          </p>
        ) : null}

        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
      </div>
    </div>
  );
}
