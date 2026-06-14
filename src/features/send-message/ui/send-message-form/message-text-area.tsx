import type { ChangeEvent, KeyboardEvent } from 'react';

import { TextArea } from '@/shared/ui';

import { useSendMessageFormContext } from './send-message-form.hooks';

export function MessageTextArea() {
  const {
    isInputDisabled,
    message,
    messageId,
    messageMaxLength,
    metaId,
    setMessage,
    setValidationError,
    submitMessage,
  } = useSendMessageFormContext();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    setValidationError(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitMessage();
    }
  };

  return (
    <>
      <label className="sr-only" htmlFor={messageId}>
        Message
      </label>
      <TextArea
        aria-describedby={metaId}
        disabled={isInputDisabled}
        id={messageId}
        maxLength={messageMaxLength + 1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Write a message"
        rows={1}
        value={message}
      />
    </>
  );
}
