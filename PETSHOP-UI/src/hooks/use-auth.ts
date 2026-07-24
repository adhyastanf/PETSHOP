/**
 * Auth hooks — TanStack Query mutations and queries for authentication.
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth-service';
import type { LoginRequest, MeResponse, RegisterRequest } from '@/types/auth';
import { ApiError } from '@/lib/api-client';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
};

/**
 * Determine the home route based on user roles.
 */
function getHomeRoute(roles: string[]): string {
  if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
    return '/admin/home';
  }
  if (
    roles.includes('PETSHOP_OWNER') ||
    roles.includes('PETSHOP_ADMIN') ||
    roles.includes('PETSHOP_STAFF') ||
    roles.includes('GROOMER') ||
    roles.includes('VETERINARIAN')
  ) {
    return '/mitra/home';
  }
  return '/customer/home';
}

/**
 * Hook: fetch the current user profile.
 * Only enabled when we have a valid access token.
 */
export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: () => authService.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook: login mutation.
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (response) => {
      setTokens(response.accessToken, response.refreshToken);

      // Fetch user profile immediately after login
      let user: MeResponse | null = null;
      try {
        user = await authService.me();
        setUser(user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
      } catch {
        // Non-blocking: user can still navigate
      }

      const route = user ? getHomeRoute(user.roles) : '/customer/home';
      router.push(route);
    },
  });
}

/**
 * Hook: register mutation.
 * Registration always creates CUSTOMER, so always redirect to customer home.
 */
export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (response) => {
      setTokens(response.accessToken, response.refreshToken);

      try {
        const user = await authService.me();
        setUser(user);
        queryClient.setQueryData(AUTH_QUERY_KEYS.me, user);
      } catch {
        // Non-blocking
      }

      router.push('/customer/home');
    },
  });
}

/**
 * Hook: logout mutation.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { refreshToken, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    },
    onSettled: () => {
      // Always clear client state, even if the API call fails
      clearAuth();
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
      router.push('/login');
    },
  });
}
