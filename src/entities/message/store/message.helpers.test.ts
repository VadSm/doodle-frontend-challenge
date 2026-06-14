import { describe, expect, it } from 'vitest';

import type { TMessage } from '../model/message.types';
import {
  hasFullPage,
  mergeMessages,
  sortMessagesChronologically,
} from './message.helpers';

const createMessage = (
  _id: string,
  createdAt: string,
  message = _id,
): TMessage => ({
  _id,
  author: 'Luka',
  createdAt,
  message,
});

describe('message helpers', () => {
  it('sorts messages chronologically', () => {
    const messages = [
      createMessage('new', '2026-06-14T10:02:00.000Z'),
      createMessage('old', '2026-06-14T10:00:00.000Z'),
      createMessage('middle', '2026-06-14T10:01:00.000Z'),
    ];

    expect(sortMessagesChronologically(messages).map(({ _id }) => _id)).toEqual(
      ['old', 'middle', 'new'],
    );
  });

  it('merges messages by id and keeps the latest copy', () => {
    const currentMessages = [
      createMessage('1', '2026-06-14T10:00:00.000Z', 'Original'),
      createMessage('2', '2026-06-14T10:02:00.000Z'),
    ];
    const incomingMessages = [
      createMessage('1', '2026-06-14T10:00:00.000Z', 'Updated'),
      createMessage('0', '2026-06-14T09:59:00.000Z'),
    ];

    expect(mergeMessages(currentMessages, incomingMessages)).toEqual([
      createMessage('0', '2026-06-14T09:59:00.000Z'),
      createMessage('1', '2026-06-14T10:00:00.000Z', 'Updated'),
      createMessage('2', '2026-06-14T10:02:00.000Z'),
    ]);
  });

  it('detects full pages for pagination', () => {
    expect(
      hasFullPage(
        Array.from({ length: 10 }, (_, index) =>
          createMessage(String(index), `2026-06-14T10:${index}0:00.000Z`),
        ),
      ),
    ).toBe(true);
    expect(hasFullPage([createMessage('1', '2026-06-14T10:00:00.000Z')])).toBe(
      false,
    );
  });
});
