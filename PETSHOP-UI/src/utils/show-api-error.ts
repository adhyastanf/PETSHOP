import { toast } from 'sonner';
import type { ApiError } from '@/lib/api-error';
import { getErrorMessage } from '@/utils/get-error-message';

/**
 * Shows an API/mutation error as a Sonner toast.
 * Known error codes map to translated messages; other backend messages are shown as-is.
 */
export function showApiError(error: unknown, t: (key: string) => string): void {
  toast.error(getErrorMessage(error as ApiError, t));
}
