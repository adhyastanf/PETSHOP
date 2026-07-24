/**
 * Auth store (Zustand) — manages access/refresh tokens and user state.
 *
 * Access token is kept in memory only. Refresh token is persisted to
 * sessionStorage for session restoration across page reloads.
 * This avoids exposing long-lived tokens in localStorage.
 */

import type { MeResponse } from '@/types/auth';
import { create } from 'zustand';

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

const REFRESH_TOKEN_KEY = 'petshop_rt';

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  setTokens: (accessToken, refreshToken) => {
    try {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch {
      // SSR or storage unavailable — continue with in-memory only
    }
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: () => {
    try {
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    try {
      const rt = sessionStorage.getItem(REFRESH_TOKEN_KEY);
      if (rt) {
        set({ refreshToken: rt, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },
}));
