import axios from 'axios'; // Sesuaikan path import ApiError Anda
import { ApiError } from './api-error';
import { ApiErrorResponse } from '@/types/auth';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return `${process.env.INTERNAL_APP_URL || 'http://localhost:3000'}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// --- INTERCEPTOR UNTUK MENANGKAP COOKIE DI SSR ---
// api.interceptors.request.use(async (config) => {
//   if (typeof window === 'undefined') {
//     try {
//       const { cookies } = await import('next/headers');
//       const cookieStore = await cookies();
//       const cookieHeader = cookieStore.toString();

//       if (cookieHeader) {
//         config.headers.Cookie = cookieHeader;
//       }
//     } catch (error) {
//       console.error('Gagal mengambil cookie di interceptor SSR:', error);
//     }
//   }
//   return config;
// });

// --- INTERCEPTOR RESPONSE UNTUK MENGEMBALIKAN APIError ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 0;

    const body: ApiErrorResponse = error.response?.data ?? {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server.',
      details: [],
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(new ApiError(status, body));
  },
);

export default api;
