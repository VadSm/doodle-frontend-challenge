import { configureStore } from '@reduxjs/toolkit';

import { messageReducer } from '@/entities/message';

export const store = configureStore({
  reducer: {
    messages: messageReducer,
  },
});

declare global {
  type TAppDispatch = typeof store.dispatch;
  type TRootState = ReturnType<typeof store.getState>;
}
