/**
 * Auth API service — functions that call backend auth endpoints.
 */

import { apiClient } from '@/lib/api-client';
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  MeResponse,
  RegisterRequest,
} from '@/types/auth';

export const authService = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
      skipAuth: true,
    });
  },

  login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
      skipAuth: true,
    });
  },

  refresh(refreshToken: string): Promise<AuthResponse> {
    return apiClient<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    });
  },

  logout(refreshToken: string): Promise<void> {
    return apiClient<void>('/auth/logout', {
      method: 'POST',
      body: { refreshToken } satisfies LogoutRequest,
    });
  },

  me(): Promise<MeResponse> {
    return apiClient<MeResponse>('/me');
  },
};
