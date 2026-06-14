import { createSlice } from '@reduxjs/toolkit';

import { EMessagesStatus, type TMessageState } from '../model/message.types';
import { hasFullPage, mergeMessages } from './message.helpers';
import {
  fetchInitialMessages,
  fetchOlderMessages,
  pollNewMessages,
  sendMessage,
} from './message.thunks';

export const initialMessageState: TMessageState = {
  messages: [],
  initialStatus: EMessagesStatus.Idle,
  olderStatus: EMessagesStatus.Idle,
  sendingStatus: EMessagesStatus.Idle,
  error: null,
  sendError: null,
  hasMoreOlder: true,
  isInitialized: false,
  pollingStatus: EMessagesStatus.Idle,
};

const messageSlice = createSlice({
  name: 'messages',
  initialState: initialMessageState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialMessages.pending, (state) => {
        state.initialStatus = EMessagesStatus.Loading;
        state.error = null;
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.initialStatus = EMessagesStatus.Succeeded;
        state.isInitialized = true;
        state.messages = mergeMessages([], action.payload);
        state.hasMoreOlder = hasFullPage(action.payload);
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        state.initialStatus = EMessagesStatus.Failed;
        state.isInitialized = true;
        state.error = action.payload ?? 'Unable to load messages';
      })

      .addCase(fetchOlderMessages.pending, (state) => {
        state.olderStatus = EMessagesStatus.Loading;
        state.error = null;
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.olderStatus = EMessagesStatus.Succeeded;
        state.messages = mergeMessages(state.messages, action.payload);
        state.hasMoreOlder = hasFullPage(action.payload);
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        state.olderStatus = EMessagesStatus.Failed;
        state.error = action.payload ?? 'Unable to load older messages';
      })

      .addCase(pollNewMessages.pending, (state) => {
        state.pollingStatus = EMessagesStatus.Loading;
      })
      .addCase(pollNewMessages.fulfilled, (state, action) => {
        state.pollingStatus = EMessagesStatus.Succeeded;
        state.messages = mergeMessages(state.messages, action.payload);
      })
      .addCase(pollNewMessages.rejected, (state) => {
        state.pollingStatus = EMessagesStatus.Failed;
      })

      .addCase(sendMessage.pending, (state) => {
        state.sendingStatus = EMessagesStatus.Loading;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingStatus = EMessagesStatus.Succeeded;
        state.messages = mergeMessages(state.messages, [action.payload]);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingStatus = EMessagesStatus.Failed;
        state.sendError = action.payload ?? 'Unable to send message';
      });
  },
});

export const messageReducer = messageSlice.reducer;
