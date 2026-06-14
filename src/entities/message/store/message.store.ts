import { createSlice } from '@reduxjs/toolkit';

import type { TMessageState } from '../model/message.types';
import { hasFullPage, mergeMessages } from './message.helpers';
import {
  fetchInitialMessages,
  fetchOlderMessages,
  pollNewMessages,
  sendMessage,
} from './message.thunks';

export const initialMessageState: TMessageState = {
  items: [],
  initialStatus: 'idle',
  olderStatus: 'idle',
  pollingStatus: 'idle',
  sendingStatus: 'idle',
  error: null,
  sendError: null,
  hasMoreOlder: true,
  initialized: false,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState: initialMessageState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialMessages.pending, (state) => {
        state.initialStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.initialStatus = 'succeeded';
        state.initialized = true;
        state.items = mergeMessages([], action.payload);
        state.hasMoreOlder = hasFullPage(action.payload);
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        state.initialStatus = 'failed';
        state.initialized = true;
        state.error = action.payload ?? 'Unable to load messages';
      })

      .addCase(fetchOlderMessages.pending, (state) => {
        state.olderStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.olderStatus = 'succeeded';
        state.items = mergeMessages(state.items, action.payload);
        state.hasMoreOlder = hasFullPage(action.payload);
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        state.olderStatus = 'failed';
        state.error = action.payload ?? 'Unable to load older messages';
      })

      .addCase(pollNewMessages.pending, (state) => {
        state.pollingStatus = 'loading';
      })
      .addCase(pollNewMessages.fulfilled, (state, action) => {
        state.pollingStatus = 'succeeded';
        state.items = mergeMessages(state.items, action.payload);
      })
      .addCase(pollNewMessages.rejected, (state) => {
        state.pollingStatus = 'failed';
      })

      .addCase(sendMessage.pending, (state) => {
        state.sendingStatus = 'loading';
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingStatus = 'succeeded';
        state.items = mergeMessages(state.items, [action.payload]);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingStatus = 'failed';
        state.sendError = action.payload ?? 'Unable to send message';
      });
  },
});

export const messageReducer = messageSlice.reducer;
