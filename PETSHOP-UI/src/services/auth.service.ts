import api from '@/lib/api';
import { AuthResponse, LoginRequest, LogoutResponse, MeResponse, RegisterRequest } from '@/types/auth';

export async function registerService(data: RegisterRequest) {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function meService(): Promise<MeResponse> {
  const res = await api.get<MeResponse>('/me');
  return res.data;
}

export async function loginService(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
}

export async function logoutService(): Promise<LogoutResponse> {
  const res = await api.post<LogoutResponse>('/auth/logout');
  return res.data;
}
