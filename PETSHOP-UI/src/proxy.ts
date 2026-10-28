import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing'; // Sesuaikan path routing Anda
import { jwtDecodeUtils } from './utils/format';
import { JWTPayload } from './types/auth';

// 1. Buat instance middleware dari next-intl
const handleIntlRouting = createMiddleware(routing);

// Atur rute yang butuh role/permission khusus
const routePermissions: RouteConfig[] = [
  {
    path: '/admin',
    requiredRoles: ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN'],
  },
  {
    path: '/finance',
    requiredPermissions: ['PERM_finance.view'],
  },
];

const protectedRoutes = ['/profile', '/settings', '/dashboard'];
const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isTokenValid = false;
  let decodedToken: JWTPayload | null = null;

  if (accessToken) {
    try {
      const decoded = jwtDecodeUtils(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp > currentTime) {
        isTokenValid = true;
        decodedToken = decoded;
      }
    } catch {
      isTokenValid = false;
    }
  }

  // Handle pengecekan prefix bahasa jika ada (misal: /en/admin -> /admin untuk pengecekan route)
  // next-intl kadang menyisipkan locale di awal path, kita bisa abaikan sementara untuk pengecekan auth
  const pathnameWithoutLocale = pathname.replace(/^\/(en|id)/, '') || '/';

  const matchedRouteConfig = routePermissions.find((route) => pathnameWithoutLocale.startsWith(route.path));
  const isProtectedRoute = protectedRoutes.some((route) => pathnameWithoutLocale.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathnameWithoutLocale.startsWith(route));

  // 1. Belum login mencoba buka halaman privat
  if ((matchedRouteConfig || isProtectedRoute) && !isTokenValid && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Sudah login mencoba buka /login atau /register
  if (isAuthRoute && isTokenValid) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Otorisasi (Cek Role / Permission)
  if (matchedRouteConfig && isTokenValid && decodedToken) {
    const userAuthorities = decodedToken.authorities || [];

    if (matchedRouteConfig.requiredRoles && matchedRouteConfig.requiredRoles.length > 0) {
      const hasRole = matchedRouteConfig.requiredRoles.some((role) => userAuthorities.includes(role));
      if (!hasRole) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    if (matchedRouteConfig.requiredPermissions && matchedRouteConfig.requiredPermissions.length > 0) {
      const hasPermission = matchedRouteConfig.requiredPermissions.some((perm) => userAuthorities.includes(perm));
      if (!hasPermission) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // 4. Lolos pengecekan Auth, teruskan ke middleware next-intl untuk menangani bahasa/cookie/locale
  return handleIntlRouting(request);
}

export const config = {
  // Matcher digabung agar next-intl dan auth berjalan di path yang sama
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

interface RouteConfig {
  path: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}
