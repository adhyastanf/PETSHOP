import api from '@/lib/api';
import { AuthResponse, LoginRequest, LogoutResponse, MeResponse, RegisterRequest } from '@/types/auth';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async me(): Promise<MeResponse> {
    const res = await api.get<MeResponse>('/me');
    return res.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async logout(): Promise<LogoutResponse> {
    const res = await api.post<LogoutResponse>('/auth/logout');
    return res.data;
  },
};
