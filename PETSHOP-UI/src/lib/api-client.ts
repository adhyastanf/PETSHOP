/**
 * COMPATIBILITY SHIM (transitional).
 *
 * The frontend refactor on `feature-login` replaced the old fetch-based
 * `apiClient` + browser-held Bearer tokens with an axios instance (`@/lib/api`)
 * that talks to same-origin Next.js route handlers (`/api/...`), which proxy to
 * the backend and manage httpOnly auth cookies + refresh.
 *
 * Phase-3 service layers (`features/config`, `features/merchant`) and several
 * admin/mitra pages still import `{ apiClient }` and `{ ApiError }` from
 * `@/lib/api-client`. To land the merge without rewriting those modules yet,
 * this shim preserves the old import surface but routes every call through the
 * new axios `api` instance (and therefore the new proxy/cookie auth).
 *
 * TODO (follow-up migration): migrate Phase-3 services to call `@/lib/api`
 * directly (or dedicated service modules) and delete this shim.
 */
import api from './api';
import { ApiError } from './api-error';
import type { ApiErrorResponse } from '@/types/auth';

export { ApiError };

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Retained for source compatibility; auth is handled by the proxy/cookies. */
  skipAuth?: boolean;
}

/**
 * Transitional wrapper preserving the legacy `apiClient<T>(endpoint, options)`
 * signature. `endpoint` is relative to the backend API base (e.g.
 * `/admin/config`); the axios instance prefixes `/api` and the Next proxy
 * forwards to `${BACKEND_URL}${endpoint}`.
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers } = options;

  try {
    const response = await api.request<T>({
      url: endpoint,
      method,
      ...(body !== undefined ? { data: body } : {}),
      ...(headers ? { headers } : {}),
    });
    // 204 No Content → axios data is '' ; normalize to undefined like the old client.
    return (response.data === '' ? undefined : response.data) as T;
  } catch (error) {
    // The axios interceptor in `@/lib/api` already rejects with ApiError.
    if (error instanceof ApiError) {
      throw error;
    }
    const body: ApiErrorResponse = {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'Request failed.',
      details: [],
      timestamp: new Date().toISOString(),
    };
    throw new ApiError(0, body);
  }
}
