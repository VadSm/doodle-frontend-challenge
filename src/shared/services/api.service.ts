import { API_BASE_URL, API_TOKEN } from '../config';

type TMethodName = string;
type TGetParams = Record<string, string | number | boolean>;
type TPostParams = Record<string, unknown>;

class ApiService {
  private async _request<TResponse>(
    method: TMethodName,
    init?: RequestInit,
  ): Promise<TResponse> {
    const response = await fetch(`${API_BASE_URL}${method}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(await this._parseApiError(response));
    }

    return (await response.json()) as TResponse;
  }

  private _getURLParams<TParams extends TGetParams>(params?: TParams) {
    const searchParams = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([name, value]) => {
      searchParams.set(name, String(value));
    });

    return searchParams.size > 0 ? `?${searchParams}` : '';
  }

  private _parseApiError = async (response: Response): Promise<string> => {
    try {
      const payload = (await response.json()) as { message?: unknown };

      if (typeof payload.message === 'string') {
        return payload.message;
      }
    } catch {
      return `Request failed with status ${response.status}`;
    }

    return `Request failed with status ${response.status}`;
  };

  public async get<TResponse>(method: TMethodName, params?: TGetParams) {
    return this._request<TResponse>(`${method}${this._getURLParams(params)}`);
  }

  public async post<TResponse>(method: TMethodName, params?: TPostParams) {
    return this._request<TResponse>(method, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  }
}

export const apiService = new ApiService();
