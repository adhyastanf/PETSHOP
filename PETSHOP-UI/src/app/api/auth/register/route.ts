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

    // Teruskan status dan data 1:1 (baik sukses maupun error dari business logic backend)
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('Proxy Error:', error);

    const errorBody: ApiErrorResponse = {
      code: 'NETWORK_ERROR',
      message: 'Gagal terhubung ke server backend.',
      details: [],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorBody, { status: 502 });
  }
}
