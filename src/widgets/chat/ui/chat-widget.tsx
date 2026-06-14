import { useEffect } from 'react';

import { SendMessageForm } from '@/features/send-message';
import {
  fetchInitialMessages,
  fetchOlderMessages,
  pollNewMessages,
  selectHasMoreOlderMessages,
  selectInitialStatus,
  selectIsInitialized,
  selectMessageError,
  selectMessages,
  selectOlderStatus,
  selectSendError,
  selectSendingStatus,
  sendMessage,
} from '@/entities/message';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { AppFrame } from '@/shared/ui';

import { ChatMessageList } from './chat-message-list';

const MESSAGE_POLL_INTERVAL_MS = 5_000;

export function ChatWidget() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessages);
  const initialStatus = useAppSelector(selectInitialStatus);
  const olderStatus = useAppSelector(selectOlderStatus);
  const sendingStatus = useAppSelector(selectSendingStatus);
  const error = useAppSelector(selectMessageError);
  const sendError = useAppSelector(selectSendError);
  const hasMoreOlder = useAppSelector(selectHasMoreOlderMessages);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isInitialLoading = initialStatus === 'loading';
  const isLoadingOlder = olderStatus === 'loading';
  const isSending = sendingStatus === 'loading';

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
        className="flex min-h-dvh w-full flex-col"
      >
        <ChatMessageList
          error={error}
          hasMoreOlder={hasMoreOlder}
          isInitialLoading={isInitialLoading}
          isLoadingOlder={isLoadingOlder}
          messages={messages}
          onLoadOlder={() => {
            void dispatch(fetchOlderMessages());
          }}
          onRetry={() => {
            void dispatch(fetchInitialMessages());
          }}
        />
        <SendMessageForm
          disabled={isInitialLoading}
          error={sendError}
          isSending={isSending}
          onSend={async (message) => {
            await dispatch(sendMessage(message)).unwrap();
          }}
        />
      </section>
    </AppFrame>
  );
}
