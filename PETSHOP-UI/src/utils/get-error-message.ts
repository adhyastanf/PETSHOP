import { ApiError } from '@/lib/api-error';
import { getTranslatedErrorMessages } from '@/lib/errors';

export function getErrorMessage(error: ApiError, t: (key: string) => string): string {
  const ERROR_MESSAGES = getTranslatedErrorMessages(t);

  if (!(error instanceof ApiError)) {
    return ERROR_MESSAGES.NETWORK_ERROR; // Pastikan key ini ada di JSON Anda
  }

  return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] ?? error.message ?? ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}
