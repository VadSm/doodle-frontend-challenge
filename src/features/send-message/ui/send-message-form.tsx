import { type FormEvent, type KeyboardEvent, useId, useState } from 'react';

import { Button, TextArea } from '@/shared/ui';

type TSendMessageFormProps = {
  disabled?: boolean;
  error: string | null;
  isSending: boolean;
  onSend: (message: string) => Promise<void> | void;
};

const MESSAGE_MAX_LENGTH = 500;

export function SendMessageForm({
  disabled = false,
  error,
  isSending,
  onSend,
}: TSendMessageFormProps) {
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const messageId = useId();
  const trimmedMessage = message.trim();
  const isMessageTooLong = message.length > MESSAGE_MAX_LENGTH;
  const isSubmitDisabled =
    disabled || isSending || trimmedMessage.length === 0 || isMessageTooLong;

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
    await onSend(trimmedMessage);
    setMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  return (
    <form aria-label="Send message" className="w-full" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={messageId}>
        Message
      </label>
      <div className="rounded-md border border-slate-200 p-2 shadow-sm backdrop-blur">
        <div className="flex items-end gap-2">
          <TextArea
            aria-describedby={`${messageId}-meta`}
            disabled={disabled || isSending}
            id={messageId}
            maxLength={MESSAGE_MAX_LENGTH + 1}
            onChange={(event) => {
              setMessage(event.target.value);
              setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write a message"
            rows={1}
            value={message}
          />
          <Button disabled={isSubmitDisabled} type="submit">
            {isSending ? 'Sending' : 'Send'}
          </Button>
        </div>
        <div
          className="mt-2 flex min-h-5 items-center justify-between gap-3 text-xs"
          id={`${messageId}-meta`}
        >
          <p
            className="text-red-700"
            role={validationError || error ? 'alert' : undefined}
          >
            {validationError ?? error ?? ''}
          </p>
          <p className="shrink-0 text-slate-500">
            {message.length}/{MESSAGE_MAX_LENGTH}
          </p>
        </div>
      </div>
    </form>
  );
}
