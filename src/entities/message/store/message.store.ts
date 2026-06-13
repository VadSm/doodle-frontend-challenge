import { createSlice } from '@reduxjs/toolkit';

type MessageState = Record<string, never>;

const messageSlice = createSlice({
  name: 'messages',
  initialState: {} satisfies MessageState,
  reducers: {},
});

export const messageReducer = messageSlice.reducer;
