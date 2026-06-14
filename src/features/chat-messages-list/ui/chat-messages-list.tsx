import { EMessagesStatus, getMessagesState } from '@/entities/message';
import { useAppSelector } from '@/shared/lib';
import { StatusText } from '@/shared/ui';

import { useChatMessageScroll } from './chat-messages-list.hooks';
import { RetryButton } from './retry-button';
import { VirtualizedMessagesList } from './virtualized-messages-list';

export function ChatMessagesList() {
  const { error, hasMoreOlder, initialStatus, messages, olderStatus } =
    useAppSelector(getMessagesState);
  const isInitialLoading = initialStatus === EMessagesStatus.Loading;
  const isLoadingOlder = olderStatus === EMessagesStatus.Loading;

  const { handleScroll, scrollRef } = useChatMessageScroll({
    hasMoreOlder,
    isInitialLoading,
    isLoadingOlder,
    messages,
  });

  const isInitialMessagesLoadError = error && messages.length === 0;

  return (
    <div
      aria-label="Message history"
      className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6"
      onScroll={handleScroll}
      ref={scrollRef}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col">
        {isInitialLoading && <StatusText>Loading messages...</StatusText>}

        {isInitialMessagesLoadError && (
          <div className="rounded-md border border-red-200 bg-white/90 p-4 text-center shadow-sm">
            <p className="mb-3 text-sm text-red-700" role="alert">
              {error}
            </p>
            <RetryButton />
          </div>
        )}

        {isLoadingOlder && <StatusText>Loading older messages...</StatusText>}

        <VirtualizedMessagesList messages={messages} scrollRef={scrollRef} />
      </div>
    </div>
  );
}
