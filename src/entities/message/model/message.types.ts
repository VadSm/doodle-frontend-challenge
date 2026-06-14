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

export enum EMessagesStatus {
  Idle = 'idle',
  Loading = 'loading',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export type TMessageState = {
  messages: TMessage[];
  initialStatus: EMessagesStatus;
  olderStatus: EMessagesStatus;
  sendingStatus: EMessagesStatus;
  error: string | null;
  sendError: string | null;
  hasMoreOlder: boolean;
  isInitialized: boolean;
  pollingStatus: EMessagesStatus;
};

export type TMessageRootState = {
  messages: TMessageState;
};
