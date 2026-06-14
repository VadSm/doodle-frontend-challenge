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

const restoreScrollPosition = (
  element: HTMLDivElement,
  previousState: { height: number; top: number },
) => {
  element.scrollTop =
    element.scrollHeight - previousState.height + previousState.top;
};

const scrollToBottom = (element: HTMLDivElement) => {
  element.scrollTop = element.scrollHeight;
};

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

    let cleanup = () => {};

    const previousFirstMessageId = previousFirstMessageIdRef.current;

    const hasLoadedOlderMessages =
      previousFirstMessageId !== undefined &&
      firstMessageId !== previousFirstMessageId;

    if (element && messages.length > 0) {
      if (hasLoadedOlderMessages && restoreScrollRef.current) {
        const previousScrollState = restoreScrollRef.current;

        restoreScrollPosition(element, previousScrollState);

        const frameId = window.requestAnimationFrame(() => {
          restoreScrollPosition(element, previousScrollState);
        });

        restoreScrollRef.current = null;

        cleanup = () => {
          window.cancelAnimationFrame(frameId);
        };
      } else if (!hasLoadedOlderMessages) {
        let secondFrameId = 0;

        scrollToBottom(element);

        const firstFrameId = window.requestAnimationFrame(() => {
          scrollToBottom(element);

          secondFrameId = window.requestAnimationFrame(() => {
            scrollToBottom(element);
          });
        });

        cleanup = () => {
          window.cancelAnimationFrame(firstFrameId);
          window.cancelAnimationFrame(secondFrameId);
        };
      }
    }

    previousFirstMessageIdRef.current = firstMessageId;

    return cleanup;
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
