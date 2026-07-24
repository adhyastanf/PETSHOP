'use client';

import { ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * 403 Forbidden page shown when user lacks the required role.
 * UX-only — backend RBAC is the real security boundary.
 */
export default function Forbidden() {
  const router = useRouter();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center'>
      <ShieldX className='size-16 text-destructive' />
      <h1 className='text-2xl font-semibold'>Akses Ditolak</h1>
      <p className='max-w-md text-muted-foreground'>
        Anda tidak memiliki izin untuk mengakses halaman ini. Jika Anda merasa ini adalah kesalahan,
        hubungi administrator.
      </p>
      <div className='flex gap-2'>
        <Button variant='outline' onClick={() => router.back()}>
          Kembali
        </Button>
        <Button onClick={() => router.push('/')}>
          Beranda
        </Button>
      </div>
    </div>
  );
}
