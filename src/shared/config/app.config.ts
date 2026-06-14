export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const API_TOKEN =
  import.meta.env.VITE_API_TOKEN ?? 'super-secret-doodle-token';

export const CHAT_AUTHOR = import.meta.env.VITE_CHAT_AUTHOR ?? 'You';

export const MESSAGE_PAGE_SIZE = 50;
