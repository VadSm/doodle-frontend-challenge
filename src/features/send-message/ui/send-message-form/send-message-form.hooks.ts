import {
  createContext,
  type FormEvent,
  useContext,
  useId,
  useState,
} from 'react';

import {
  EMessagesStatus,
  getMessagesState,
  sendMessage,
} from '@/entities/message';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

const MESSAGE_MAX_LENGTH = 500;

export function useSendMessageFormValue() {
  const dispatch = useAppDispatch();
  const { initialStatus, sendError, sendingStatus } =
    useAppSelector(getMessagesState);

  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const messageId = useId();

  const trimmedMessage = message.trim();
  const isInitialLoading = initialStatus === EMessagesStatus.Loading;
  const isSending = sendingStatus === EMessagesStatus.Loading;
  const isMessageTooLong = message.length > MESSAGE_MAX_LENGTH;
  const isSubmitDisabled =
    isInitialLoading ||
    isSending ||
    trimmedMessage.length === 0 ||
    isMessageTooLong;
  const metaId = `${messageId}-meta`;
  const visibleError = validationError ?? sendError;

  const submitMessage = async () => {
    if (trimmedMessage.length === 0) {
      setValidationError('Message cannot be empty.');
      return;
    }

    if (isMessageTooLong) {
      setValidationError(`Message cannot exceed ${MESSAGE_MAX_LENGTH} chars.`);
      return;
    }

    setValidationError(null);

    await dispatch(sendMessage(trimmedMessage)).unwrap();

    setMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage();
  };

  return {
    handleSubmit,
    isInputDisabled: isInitialLoading || isSending,
    isSending,
    isSubmitDisabled,
    message,
    messageId,
    messageMaxLength: MESSAGE_MAX_LENGTH,
    metaId,
    setMessage,
    setValidationError,
    submitMessage,
    visibleError,
  };
}

type TSendMessageFormContextValue = ReturnType<typeof useSendMessageFormValue>;

export const SendMessageFormContext =
  createContext<TSendMessageFormContextValue | null>(null);

export function useSendMessageFormContext() {
  const context = useContext(SendMessageFormContext);

  if (!context) {
    throw new Error(
      'useSendMessageFormContext must be used within SendMessageFormContext',
    );
  }

  return context;
}
