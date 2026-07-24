'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Auth layout — redirects authenticated users away from login/register.
 * Provides a centered card layout for auth forms.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/customer/home');
    }
  }, [isAuthenticated, isHydrated, router]);

  // While hydrating or if authenticated (about to redirect), show nothing
  if (!isHydrated || isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 p-4'>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
