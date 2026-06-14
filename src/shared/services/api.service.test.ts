import { afterEach, describe, expect, it, vi } from 'vitest';

import { API_BASE_URL, API_TOKEN } from '../config';
import { apiService } from './api.service';

const mockFetch = vi.fn<typeof fetch>();

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

describe('apiService', () => {
  it('sends GET requests with auth header and query params', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal('fetch', mockFetch);

    const result = await apiService.get<{ ok: boolean }>('/messages', {
      after: '2026-06-14T10:00:00.000Z',
      limit: 10,
    });

    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/messages?after=2026-06-14T10%3A00%3A00.000Z&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );
  });

  it('sends POST requests with json body and auth header', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ _id: '1' }), { status: 201 }),
    );
    vi.stubGlobal('fetch', mockFetch);

    const result = await apiService.post<{ _id: string }>('/messages', {
      author: 'You',
      message: 'Hello',
    });

    expect(result).toEqual({ _id: '1' });
    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/messages`, {
      body: JSON.stringify({ author: 'You', message: 'Hello' }),
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  it('throws api error messages when request fails', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      }),
    );
    vi.stubGlobal('fetch', mockFetch);

    await expect(apiService.get('/messages')).rejects.toThrow('Unauthorized');
  });
});
