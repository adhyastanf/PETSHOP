import { ApiError } from '@/lib/api-error';
import { ERROR_MESSAGES } from '@/lib/errors';

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ?? error.message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}
