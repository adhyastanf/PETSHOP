/**
 * Session restoration hook.
 * On app mount, checks for a persisted refresh token and attempts
 * to silently restore the session (get new access token + user profile).
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth-service';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEYS } from '@/hooks/use-auth';

export function useSessionRestore() {
  const { hydrate, refreshToken, isHydrated, isAuthenticated, setTokens, setUser, clearAuth } =
    useAuthStore();
  const queryClient = useQueryClient();
  const attempted = useRef(false);

  // Step 1: hydrate refresh token from sessionStorage
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Step 2: if we have a refresh token but no access token, attempt silent refresh
  useEffect(() => {
    if (!isHydrated || attempted.current) return;
    if (isAuthenticated) return; // already have tokens
    if (!refreshToken) return; // nothing to restore

    attempted.current = true;

    (async () => {
      try {
        const authResponse = await authService.refresh(refreshToken);
        setTokens(authResponse.accessToken, authResponse.refreshToken);

        const user = await authService.me();
        setUser(user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
      } catch {
        clearAuth();
      }
    })();
  }, [isHydrated, isAuthenticated, refreshToken, setTokens, setUser, clearAuth, queryClient]);

  return { isHydrated };
}
