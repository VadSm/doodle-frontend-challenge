import { createAsyncThunk } from '@reduxjs/toolkit';

import { CHAT_AUTHOR, MESSAGE_PAGE_SIZE } from '@/shared/config';

import { messageApi } from '../api/message.api';
import type { TMessage, TMessageRootState } from '../model/message.types';
import {
  selectNewestMessageCreatedAt,
  selectOldestMessageCreatedAt,
} from './message.selectors';

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Something went wrong';

export const fetchInitialMessages = createAsyncThunk<
  TMessage[],
  void,
  { rejectValue: string }
>('messages/fetchInitial', async (_, { rejectWithValue }) => {
  try {
    return await messageApi.fetchMessages({ limit: MESSAGE_PAGE_SIZE });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOlderMessages = createAsyncThunk<
  TMessage[],
  void,
  { rejectValue: string; state: TMessageRootState }
>('messages/fetchOlder', async (_, { getState, rejectWithValue }) => {
  const before = selectOldestMessageCreatedAt(getState());

  if (!before) {
    return [];
  }

  try {
    return await messageApi.fetchMessages({
      before,
      limit: MESSAGE_PAGE_SIZE,
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const pollNewMessages = createAsyncThunk<
  TMessage[],
  void,
  { rejectValue: string; state: TMessageRootState }
>('messages/pollNew', async (_, { getState, rejectWithValue }) => {
  const after = selectNewestMessageCreatedAt(getState());

  if (!after) {
    return [];
  }

  try {
    return await messageApi.fetchMessages({
      after,
      limit: MESSAGE_PAGE_SIZE,
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const sendMessage = createAsyncThunk<
  TMessage,
  string,
  { rejectValue: string }
>('messages/send', async (message, { rejectWithValue }) => {
  try {
    return await messageApi.createMessage({
      author: CHAT_AUTHOR,
      message,
    });
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
