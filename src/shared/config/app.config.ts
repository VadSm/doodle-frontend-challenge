function getRequiredEnvValue(key: keyof ImportMetaEnv) {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

export const API_BASE_URL = getRequiredEnvValue('VITE_API_BASE_URL');

export const API_TOKEN = getRequiredEnvValue('VITE_API_TOKEN');

export const CHAT_AUTHOR = import.meta.env.VITE_CHAT_AUTHOR ?? 'You';
