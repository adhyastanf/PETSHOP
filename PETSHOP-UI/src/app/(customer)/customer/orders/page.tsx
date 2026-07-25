'use client';

import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <main className='py-10 px-4'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <h1 className='text-2xl font-semibold'>Pesanan Saya</h1>

        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <ShoppingBag className='size-12 text-muted-foreground/40' />
            <p className='mt-4 text-lg font-medium'>Belum ada pesanan</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Pesanan Anda akan muncul di sini setelah checkout.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
