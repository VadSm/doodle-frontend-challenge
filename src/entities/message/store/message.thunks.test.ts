import { afterEach, describe, expect, it, vi } from 'vitest';

import { CHAT_AUTHOR } from '@/shared/config';

import { messageApi } from '../api/message.api';
import {
  EMessagesStatus,
  type TMessageRootState,
} from '../model/message.types';
import { MESSAGE_PAGE_SIZE } from './message.const';
import {
  fetchInitialMessages,
  fetchOlderMessages,
  pollNewMessages,
  sendMessage,
} from './message.thunks';

const dispatch = vi.fn();

const getState = (): TMessageRootState => ({
  messages: {
    error: null,
    hasMoreOlder: true,
    initialStatus: EMessagesStatus.Succeeded,
    isInitialized: true,
    messages: [
      {
        _id: 'oldest',
        author: 'Luka',
        createdAt: '2026-06-14T10:00:00.000Z',
        message: 'Oldest',
      },
      {
        _id: 'newest',
        author: 'Nina',
        createdAt: '2026-06-14T10:10:00.000Z',
        message: 'Newest',
      },
    ],
    olderStatus: EMessagesStatus.Idle,
    pollingStatus: EMessagesStatus.Idle,
    sendError: null,
    sendingStatus: EMessagesStatus.Idle,
  },
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
  dispatch.mockReset();
});

describe('message thunks', () => {
  it('fetches initial messages before current time', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-14T12:00:00.000Z'));
    const fetchMessages = vi
      .spyOn(messageApi, 'fetchMessages')
      .mockResolvedValueOnce([]);

    await fetchInitialMessages()(dispatch, getState, undefined);

    expect(fetchMessages).toHaveBeenCalledWith({
      before: '2026-06-14T12:00:00.000Z',
      limit: MESSAGE_PAGE_SIZE,
    });
    vi.useRealTimers();
  });

  it('fetches older messages before the oldest loaded message', async () => {
    const fetchMessages = vi
      .spyOn(messageApi, 'fetchMessages')
      .mockResolvedValueOnce([]);

    await fetchOlderMessages()(dispatch, getState, undefined);

    expect(fetchMessages).toHaveBeenCalledWith({
      before: '2026-06-14T10:00:00.000Z',
      limit: MESSAGE_PAGE_SIZE,
    });
  });

  it('polls newer messages after the newest loaded message', async () => {
    const fetchMessages = vi
      .spyOn(messageApi, 'fetchMessages')
      .mockResolvedValueOnce([]);

    await pollNewMessages()(dispatch, getState, undefined);

    expect(fetchMessages).toHaveBeenCalledWith({
      after: '2026-06-14T10:10:00.000Z',
      limit: MESSAGE_PAGE_SIZE,
    });
  });

  it('sends messages as configured chat author', async () => {
    const createMessage = vi
      .spyOn(messageApi, 'createMessage')
      .mockResolvedValueOnce({
        _id: 'created',
        author: CHAT_AUTHOR,
        createdAt: '2026-06-14T12:00:00.000Z',
        message: 'Hello',
      });

    await sendMessage('Hello')(dispatch, getState, undefined);

    expect(createMessage).toHaveBeenCalledWith({
      author: CHAT_AUTHOR,
      message: 'Hello',
    });
  });

  it('returns reject values when api calls fail', async () => {
    vi.spyOn(messageApi, 'fetchMessages').mockRejectedValueOnce(
      new Error('Network failed'),
    );

    const result = await fetchOlderMessages()(dispatch, getState, undefined);

    expect(fetchOlderMessages.rejected.match(result)).toBe(true);
    expect(result.payload).toBe('Network failed');
  });
});
