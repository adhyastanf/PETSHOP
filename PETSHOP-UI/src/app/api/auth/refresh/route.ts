import { cookies } from 'next/headers';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { ApiErrorResponse } from '@/types/auth'; // Sesuaikan path type Anda

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // Jika tidak ada refresh token di cookie, tolak akses (Unauthorized)
    if (!refreshToken) {
      const errorBody: ApiErrorResponse = {
        code: 'UNAUTHORIZED',
        message: 'Refresh token tidak ditemukan.',
        details: [],
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorBody, { status: 401 });
    }

    // Tembak request refresh token ke backend Spring Boot
    const response = await axios.post(`${process.env.BACKEND_URL}/auth/refresh`, { refreshToken }, { validateStatus: () => true });

    // Jika backend menolak refresh token (misal sudah expired/invalid)
    if (response.status !== 200) {
      // Hapus cookie yang ada karena sudah tidak valid
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');

      return NextResponse.json(response.data, { status: response.status });
    }

    // Jika sukses, ambil accessToken yang baru dari response backend
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 15, // 15 menit
      });
    }

    // (Opsional) Jika backend juga mengirimkan refresh token baru (token rotation)
    if (newRefreshToken) {
      cookieStore.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 hari
      });
    }

    // Kembalikan respons sukses ke client
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Refresh Token Error:', error);

    const errorBody: ApiErrorResponse = {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server backend saat memperbarui token.',
      details: [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorBody, { status: 502 });
  }
}
