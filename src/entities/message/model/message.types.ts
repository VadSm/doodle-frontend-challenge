export type TMessage = {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
};

export type TCreateMessageParams = {
  message: string;
  author: string;
};

export type TFetchMessagesParams = {
  limit?: number;
  after?: string;
  before?: string;
};

export type TMessagesStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type TMessageState = {
  items: TMessage[];
  initialStatus: TMessagesStatus;
  olderStatus: TMessagesStatus;
  pollingStatus: TMessagesStatus;
  sendingStatus: TMessagesStatus;
  error: string | null;
  sendError: string | null;
  hasMoreOlder: boolean;
  initialized: boolean;
};

export type TMessageRootState = {
  messages: TMessageState;
};
