'use client';

import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>Pengaturan</h1>

      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Settings className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>Segera hadir</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          Pengaturan akun, notifikasi, dan preferensi akan tersedia di sini.
        </p>
      </div>
    </div>
  );
}
