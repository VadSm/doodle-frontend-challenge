import { useEffect } from 'react';

import { ChatMessagesList } from '@/features/chat-messages-list';
import { SendMessageForm } from '@/features/send-message';
import {
  fetchInitialMessages,
  getMessagesState,
  pollNewMessages,
} from '@/entities/message';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { AppFrame } from '@/shared/ui';

const MESSAGE_POLL_INTERVAL_MS = 5_000;

export function ChatWidget() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector(getMessagesState);

  useEffect(() => {
    if (!isInitialized) {
      void dispatch(fetchInitialMessages());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void dispatch(pollNewMessages());
    }, MESSAGE_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <AppFrame>
      <section
        aria-label="Doodle Chat"
        className="flex h-dvh w-full flex-col overflow-hidden"
      >
        <ChatMessagesList />
        <div className="shrink-0 bg-white/90 p-4">
          <div className="mx-auto max-w-[640px]">
            <SendMessageForm />
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
