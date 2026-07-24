/**
 * Auth-related TypeScript types matching the backend DTOs.
 */

// --- Requests ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

// --- Responses ---

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface MeResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  status: string;
  roles: string[];
}

// --- Error ---

export interface ApiErrorResponse {
  code: string;
  message: string;
  details: string[];
  timestamp: string;
  traceId?: string;
}
