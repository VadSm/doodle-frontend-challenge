import { CHAT_AUTHOR } from '@/shared/config';

import type { TMessageRootState } from '../model/message.types';

export const selectMessages = (state: TMessageRootState) =>
  state.messages.items;

export const selectInitialStatus = (state: TMessageRootState) =>
  state.messages.initialStatus;

export const selectOlderStatus = (state: TMessageRootState) =>
  state.messages.olderStatus;

export const selectSendingStatus = (state: TMessageRootState) =>
  state.messages.sendingStatus;

export const selectMessageError = (state: TMessageRootState) =>
  state.messages.error;

export const selectSendError = (state: TMessageRootState) =>
  state.messages.sendError;

export const selectHasMoreOlderMessages = (state: TMessageRootState) =>
  state.messages.hasMoreOlder;

export const selectIsInitialized = (state: TMessageRootState) =>
  state.messages.initialized;

export const selectOldestMessageCreatedAt = (
  state: TMessageRootState,
): string | undefined => state.messages.items.at(0)?.createdAt;

export const selectNewestMessageCreatedAt = (
  state: TMessageRootState,
): string | undefined => state.messages.items.at(-1)?.createdAt;

export const selectIsOwnMessage = (_state: TMessageRootState, author: string) =>
  author === CHAT_AUTHOR;
