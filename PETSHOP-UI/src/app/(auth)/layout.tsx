'use client';

import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

/**
 * Auth layout — redirects authenticated users away from login/register.
 * Provides a centered card layout for auth forms with Oyen branding.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace('/customer/home');
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <div className='mb-6 flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <PawPrint className='size-8 text-primary' />
          <span className='text-2xl font-bold text-foreground'>Oyen</span>
        </div>
        <p className='text-sm text-muted-foreground'>{t('common.tagline')}</p>
      </div>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
