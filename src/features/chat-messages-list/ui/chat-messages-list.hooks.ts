import { useLayoutEffect, useRef } from 'react';

import { fetchOlderMessages, type TMessage } from '@/entities/message';
import { useAppDispatch } from '@/shared/lib';

type TUseChatMessageScrollParams = {
  hasMoreOlder: boolean;
  isInitialLoading: boolean;
  isLoadingOlder: boolean;
  messages: TMessage[];
};

const LOAD_OLDER_OFFSET = 120;

export function useChatMessageScroll({
  hasMoreOlder,
  isInitialLoading,
  isLoadingOlder,
  messages,
}: TUseChatMessageScrollParams) {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousFirstMessageIdRef = useRef<string | undefined>(undefined);
  const restoreScrollRef = useRef<{ height: number; top: number } | null>(null);
  const firstMessageId = messages.at(0)?._id;

  useLayoutEffect(() => {
    const element = scrollRef.current;
    const previousFirstMessageId = previousFirstMessageIdRef.current;
    const hasLoadedOlderMessages =
      previousFirstMessageId !== undefined &&
      firstMessageId !== previousFirstMessageId;

    if (element && messages.length > 0) {
      if (hasLoadedOlderMessages && restoreScrollRef.current) {
        element.scrollTop =
          element.scrollHeight -
          restoreScrollRef.current.height +
          restoreScrollRef.current.top;
        restoreScrollRef.current = null;
      } else if (!hasLoadedOlderMessages) {
        element.scrollTop = element.scrollHeight;
      }
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
      restoreScrollRef.current = {
        height: scrollRef.current.scrollHeight,
        top: scrollRef.current.scrollTop,
      };
      void dispatch(fetchOlderMessages());
    }
  };

  return {
    handleScroll,
    scrollRef,
  };
}
