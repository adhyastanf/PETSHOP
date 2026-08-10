import { AUTH_ERROR_MESSAGES } from './auth-errors';
import { COMMON_ERROR_MESSAGES } from './common-errors';

export const ERROR_MESSAGES = {
  ...AUTH_ERROR_MESSAGES,
  ...COMMON_ERROR_MESSAGES,
} as const;
