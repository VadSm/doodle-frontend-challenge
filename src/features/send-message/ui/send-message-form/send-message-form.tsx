import { Button } from '@/shared/ui';

import { MessageTextArea } from './message-text-area';
import {
  SendMessageFormContext,
  useSendMessageFormContext,
  useSendMessageFormValue,
} from './send-message-form.hooks';

function SendMessageFormContent() {
  const {
    handleSubmit,
    isSending,
    isSubmitDisabled,
    message,
    messageMaxLength,
    metaId,
    visibleError,
  } = useSendMessageFormContext();

  return (
    <form aria-label="Send message" className="w-full" onSubmit={handleSubmit}>
      <div className="rounded-md border border-slate-200 p-2 shadow-sm backdrop-blur">
        <div className="flex items-end gap-2">
          <MessageTextArea />
          <Button disabled={isSubmitDisabled} type="submit">
            {isSending ? 'Sending' : 'Send'}
          </Button>
        </div>
        <div
          className="mt-2 flex min-h-5 items-center justify-between gap-3 text-xs"
          id={metaId}
        >
          <p className="text-red-700" role={visibleError ? 'alert' : undefined}>
            {visibleError ?? ''}
          </p>
          <p className="shrink-0 text-slate-500">
            {message.length}/{messageMaxLength}
          </p>
        </div>
      </div>
    </form>
  );
}

export function SendMessageForm() {
  const value = useSendMessageFormValue();

  return (
    <SendMessageFormContext.Provider value={value}>
      <SendMessageFormContent />
    </SendMessageFormContext.Provider>
  );
}
