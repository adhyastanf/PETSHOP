import { ApiErrorResponse } from '@/types/auth'; // Sesuaikan path import type Anda
import axios, { AxiosResponse } from 'axios';
import { deleteCookie } from 'cookies-next/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function handler(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/^\/api/, '');
  const targetUrl = `${process.env.BACKEND_URL}${pathname}${url.search}`;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const incomingHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    incomingHeaders[key] = value;
  });

  delete incomingHeaders['host'];
  delete incomingHeaders['content-length'];

  let bodyData: BodyInit | Record<string, unknown> | undefined = undefined;
  const contentType = request.headers.get('content-type') || '';

  if (!['GET', 'HEAD'].includes(request.method)) {
    try {
      if (contentType.includes('multipart/form-data')) {
        bodyData = await request.formData();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        const urlSearchParams = new URLSearchParams();
        formData.forEach((value, key) => {
          urlSearchParams.append(key, value.toString());
        });
        bodyData = urlSearchParams.toString();
      } else if (contentType.includes('application/json')) {
        bodyData = (await request.json()) as Record<string, unknown>;
      } else {
        bodyData = await request.text();
      }
    } catch {
      // Body kosong
    }
  }

  const sendToBackend = async (token?: string): Promise<AxiosResponse> => {
    return await axios({
      url: targetUrl,
      method: request.method,
      headers: {
        ...incomingHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      data: bodyData,
      validateStatus: () => true,
    });
  };

  try {
    let response = await sendToBackend(accessToken);

    if (response.status === 401) {
      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (!refreshToken) {
        return NextResponse.json(response.data, { status: response.status });
      }

      const refreshRes = await axios.post(`${process.env.BACKEND_URL}/auth/refresh`, { refreshToken }, { validateStatus: () => true });

      if (refreshRes.status === 200 && refreshRes.data?.accessToken) {
        const { accessToken, refreshToken, expiresIn } = refreshRes.data;

        cookieStore.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: expiresIn,
        });

        cookieStore.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
        });

        response = await sendToBackend(accessToken);
      } else {
        await deleteCookie('accessToken', { cookies });
        await deleteCookie('refreshToken', { cookies });
        return NextResponse.json(refreshRes.data, { status: refreshRes.status });
      }
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: response.status });
    }

    // Mengembalikan response sukses maupun error business logic 1:1 dari Spring Boot
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

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
