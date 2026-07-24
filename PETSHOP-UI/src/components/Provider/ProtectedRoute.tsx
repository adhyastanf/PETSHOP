'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Forbidden from '@/components/feedback/Forbidden';

export type AppRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CUSTOMER'
  | 'PETSHOP_OWNER'
  | 'PETSHOP_ADMIN'
  | 'PETSHOP_STAFF'
  | 'GROOMER'
  | 'VETERINARIAN';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, user must have at least one of these roles. */
  allowedRoles?: AppRole[];
}

/**
 * ProtectedRoute — redirects unauthenticated users to login.
 * If allowedRoles is provided, shows 403 when the user lacks the required role.
 * This is UX/navigation control only — backend RBAC is the security boundary.
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated, refreshToken, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated && !refreshToken) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, refreshToken, router]);

  // Show spinner while hydrating or while a session restore might still be in progress
  if (!isHydrated || (!isAuthenticated && refreshToken)) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  // Not authenticated and no refresh token — about to redirect
  if (!isAuthenticated) {
    return null;
  }

  // Role check: if allowedRoles specified and user loaded, verify role match
  // SUPER_ADMIN bypasses all frontend role checks
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRoles = user.roles ?? [];

    if (userRoles.includes('SUPER_ADMIN')) {
      return <>{children}</>;
    }

    const hasRole = userRoles.some((role) => allowedRoles.includes(role as AppRole));

    if (!hasRole) {
      return <Forbidden />;
    }
  }

  return <>{children}</>;
}
