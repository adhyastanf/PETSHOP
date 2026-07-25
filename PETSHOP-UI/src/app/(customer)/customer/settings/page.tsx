'use client';

import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <main className='py-10 px-4'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <h1 className='text-2xl font-semibold'>Pengaturan</h1>

        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <Settings className='size-12 text-muted-foreground/40' />
            <p className='mt-4 text-lg font-medium'>Segera hadir</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Pengaturan akun, notifikasi, dan preferensi akan tersedia di sini.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
