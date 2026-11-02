/**
 * COMPATIBILITY SHIM (transitional).
 *
 * The frontend refactor on `feature-login` removed the token-in-browser auth
 * model (this Zustand store) in favor of httpOnly cookies managed by the
 * Next.js API route handlers + proxy, with the current user exposed via the
 * `useMe()` React Query hook (`@/hooks/use-auth`).
 *
 * Several Phase-3 modules still import `useAuthStore` to read `user` /
 * `isAuthenticated`:
 *   - features/config/query.ts, features/merchant/query.ts  (gate `enabled:`)
 *   - [locale]/(mitra)/* pages                              (read `user`)
 * and the legacy tests use `useAuthStore.getState()/.setState()`.
 *
 * To land the merge without rewriting those modules yet, this shim keeps the
 * old import surface but derives `user` / `isAuthenticated` from the React
 * Query `me` cache at call time, so runtime behaviour stays correct under the
 * new cookie-based auth. Token fields/actions are retained as inert no-ops for
 * source/test compatibility.
 *
 * TODO (follow-up migration): replace `useAuthStore` usages with `useMe()` and
 * delete this shim together with the old auth-store tests.
 */
'use client';

import { create } from 'zustand';
import type { MeResponse } from '@/types/auth';
import { useMe } from '@/hooks/use-auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: MeResponse | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: MeResponse) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

type AuthStore = AuthState & AuthActions;

/**
 * Internal plain Zustand store retained ONLY so legacy call sites using
 * `useAuthStore.getState()` / `.setState()` (currently just tests) keep working.
 * It is NOT the source of truth for authentication anymore.
 */
const internalStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: true,
  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken, isAuthenticated: Boolean(accessToken) }),
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () =>
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
  hydrate: () => set({ isHydrated: true }),
}));

/**
 * Hook form: `const { user, isAuthenticated } = useAuthStore();`
 *
 * `user` / `isAuthenticated` reflect the current session via `useMe()`.
 * Token fields and actions are inert (auth is cookie-based now).
 */
function useAuthStore(): AuthStore {
  const { data: me } = useMe();
  const base = internalStore();
  return {
    ...base,
    user: me ?? null,
    isAuthenticated: Boolean(me),
  };
}

// Preserve Zustand static accessors for legacy `.getState()/.setState()` usage.
useAuthStore.getState = internalStore.getState;
useAuthStore.setState = internalStore.setState;
useAuthStore.subscribe = internalStore.subscribe;

export { useAuthStore };
