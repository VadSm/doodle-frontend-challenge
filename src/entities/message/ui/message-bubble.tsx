import { CHAT_AUTHOR } from '@/shared/config';
import { cn, formatMessageDateTime } from '@/shared/lib';

import type { TMessage } from '../model/message.types';

type TMessageBubbleProps = {
  message: TMessage;
};

export function MessageBubble({ message }: TMessageBubbleProps) {
  const isOwnMessage = message.author === CHAT_AUTHOR;

  return (
    <article className={cn('flex w-full', isOwnMessage && 'justify-end')}>
      <div
        className={cn(
          'w-fit max-w-[240px] rounded-md border px-4 py-3 shadow-sm sm:max-w-[420px] md:max-w-[640px] md:px-6 md:py-5',
          isOwnMessage
            ? 'border-amber-200 bg-amber-100'
            : 'border-slate-200 bg-white',
        )}
      >
        <p className="mb-1 text-sm text-slate-400">{message.author}</p>
        <p className="whitespace-pre-wrap break-words text-[1.0625rem] leading-7 text-slate-800">
          {message.message}
        </p>
        <time
          className="mt-2 block text-right text-sm text-slate-400"
          dateTime={message.createdAt}
        >
          {formatMessageDateTime(message.createdAt)}
        </time>
      </div>
    </article>
  );
}
