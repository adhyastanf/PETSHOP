import { cookies } from 'next/headers';
import axios from 'axios';
import { ApiErrorResponse } from '@/types/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\/api/, '');

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const payload = {
      refreshToken,
    };

    // (Opsional) Jika backend Anda butuh endpoint hit saat logout untuk blacklist token
    if (accessToken) {
      await axios.post(
        `${process.env.BACKEND_URL}`.concat(pathname),
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          validateStatus: () => true,
        },
      );
    }

    // Hapus cookie HttpOnly di browser
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logout berhasil' }, { status: 200 });
  } catch (error) {
    console.error('Proxy Error:', error);

    // Tetap hapus cookie di sisi client meskipun backend gagal dijangkau
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    const errorBody: ApiErrorResponse = {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server backend, sesi lokal telah dibersihkan.',
      details: [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorBody, { status: 502 });
  }
}
