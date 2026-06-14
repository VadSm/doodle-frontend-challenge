import type { TMessageRootState } from '../model/message.types';

export const getMessagesState = (state: TMessageRootState) => state.messages;

export const selectOldestMessageCreatedAt = (
  state: TMessageRootState,
): string | undefined => getMessagesState(state).messages.at(0)?.createdAt;

export const selectNewestMessageCreatedAt = (
  state: TMessageRootState,
): string | undefined => getMessagesState(state).messages.at(-1)?.createdAt;
