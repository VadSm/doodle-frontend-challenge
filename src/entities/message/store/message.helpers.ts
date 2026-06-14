import type { TMessage } from '../model/message.types';
import { MESSAGE_PAGE_SIZE } from './message.const';

export const sortMessagesChronologically = (messages: TMessage[]): TMessage[] =>
  [...messages].sort(
    (left, right) =>
      new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );

export const mergeMessages = (
  currentMessages: TMessage[],
  incomingMessages: TMessage[],
): TMessage[] => {
  const messagesById = new Map<string, TMessage>();

  for (const message of currentMessages) {
    messagesById.set(message._id, message);
  }

  for (const message of incomingMessages) {
    messagesById.set(message._id, message);
  }

  return sortMessagesChronologically([...messagesById.values()]);
};

export const hasFullPage = (messages: TMessage[]): boolean =>
  messages.length >= MESSAGE_PAGE_SIZE;
