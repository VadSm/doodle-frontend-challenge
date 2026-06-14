import { apiService } from '@/shared/services';

import type {
  TCreateMessageParams,
  TFetchMessagesParams,
  TMessage,
} from '../model/message.types';

export const messageApi = {
  fetchMessages(params: TFetchMessagesParams = {}): Promise<TMessage[]> {
    return apiService.get<TMessage[]>('/messages', params);
  },

  createMessage(params: TCreateMessageParams): Promise<TMessage> {
    return apiService.post<TMessage>('/messages', params);
  },
};
