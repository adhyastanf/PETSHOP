/**
 * Centralized API client with auth header injection and token refresh.
 */

import { useAuthStore } from '@/store/auth-store';
import type { ApiErrorResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details: string[];
  public traceId?: string;

  constructor(status: number, body: ApiErrorResponse) {
    super(body.message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code ?? `HTTP_${status}`;
    this.details = body.details ?? [];
    this.traceId = body.traceId;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Skip auth header injection (for public endpoints like login/register) */
  skipAuth?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function attemptTokenRefresh(): Promise<boolean> {
  const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

  if (!refreshToken) {
    clearAuth();
    return false;
  }

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearAuth();
      return false;
    }

    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, body, headers: customHeaders, ...restOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (!skipAuth) {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res = await fetch(`${API_URL}${endpoint}`, config);

  // If 401 and we have a refresh token, attempt refresh and retry once
  if (res.status === 401 && !skipAuth) {
    // Deduplicate concurrent refresh attempts
    if (!refreshPromise) {
      refreshPromise = attemptTokenRefresh().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;

    if (refreshed) {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      res = await fetch(`${API_URL}${endpoint}`, { ...config, headers });
    }
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let errorBody: ApiErrorResponse;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = {
        code: 'UNKNOWN_ERROR',
        message: `Request failed with status ${res.status}`,
        details: [],
        timestamp: new Date().toISOString(),
      };
    }
    throw new ApiError(res.status, errorBody);
  }

  const json = await res.json();
  return json as T;
}
