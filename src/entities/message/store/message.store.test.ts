import { describe, expect, it } from 'vitest';

import type { TMessage } from '../model/message.types';
import { initialMessageState, messageReducer } from './message.store';
import {
  fetchInitialMessages,
  fetchOlderMessages,
  pollNewMessages,
  sendMessage,
} from './message.thunks';

const createMessage = (_id: string, createdAt: string): TMessage => ({
  _id,
  author: 'Luka',
  createdAt,
  message: _id,
});

describe('messageReducer', () => {
  it('stores initial messages in chronological order', () => {
    const state = messageReducer(
      initialMessageState,
      fetchInitialMessages.fulfilled(
        [
          createMessage('2', '2026-06-14T10:02:00.000Z'),
          createMessage('1', '2026-06-14T10:01:00.000Z'),
        ],
        'request-id',
      ),
    );

    expect(state.initialStatus).toBe('succeeded');
    expect(state.initialized).toBe(true);
    expect(state.items.map(({ _id }) => _id)).toEqual(['1', '2']);
    expect(state.hasMoreOlder).toBe(false);
  });

  it('prepends older messages and preserves existing messages', () => {
    const loadedState = {
      ...initialMessageState,
      items: [
        createMessage('2', '2026-06-14T10:02:00.000Z'),
        createMessage('3', '2026-06-14T10:03:00.000Z'),
      ],
    };

    const state = messageReducer(
      loadedState,
      fetchOlderMessages.fulfilled(
        [
          createMessage('1', '2026-06-14T10:01:00.000Z'),
          createMessage('2', '2026-06-14T10:02:00.000Z'),
        ],
        'request-id',
      ),
    );

    expect(state.olderStatus).toBe('succeeded');
    expect(state.items.map(({ _id }) => _id)).toEqual(['1', '2', '3']);
  });

  it('appends polled messages without duplicating existing ids', () => {
    const loadedState = {
      ...initialMessageState,
      items: [createMessage('1', '2026-06-14T10:01:00.000Z')],
    };

    const state = messageReducer(
      loadedState,
      pollNewMessages.fulfilled(
        [
          createMessage('1', '2026-06-14T10:01:00.000Z'),
          createMessage('2', '2026-06-14T10:02:00.000Z'),
        ],
        'request-id',
      ),
    );

    expect(state.items.map(({ _id }) => _id)).toEqual(['1', '2']);
  });

  it('stores send errors separately from history errors', () => {
    const state = messageReducer(
      initialMessageState,
      sendMessage.rejected(null, 'request-id', 'Hello', 'Unable to send'),
    );

    expect(state.sendingStatus).toBe('failed');
    expect(state.sendError).toBe('Unable to send');
    expect(state.error).toBeNull();
  });
});
