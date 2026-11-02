import { cookies } from 'next/headers';
import axios from 'axios';
import { ApiErrorResponse } from '@/types/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\/api/, '');

    const body = await request.json();

    const response = await axios.post(`${process.env.BACKEND_URL}`.concat(pathname), body, {
      validateStatus: () => true,
    });

    // Jika gagal (misal 400 Bad Request, 401 Unauthorized dari backend),
    // teruskan respons data dan status kodenya secara 1:1 mentah-mentah dari Spring Boot
    if (response.status !== 200) {
      return NextResponse.json(response.data, { status: response.status });
    }
    
    const { accessToken, refreshToken, expiresIn } = response.data;
    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn, // Gunakan expiresIn dari response
    });

    cookieStore.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    // Tetap kembalikan response.data asli dari Spring Boot saat sukses (atau sesuaikan jika butuh pesan kustom)
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error:', error);

    // Fallback error menggunakan struktur ApiErrorResponse Anda jika koneksi backend mati total (Network Error / 502)
    const errorBody: ApiErrorResponse = {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server backend.',
      details: [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorBody, { status: 502 });
  }
}
