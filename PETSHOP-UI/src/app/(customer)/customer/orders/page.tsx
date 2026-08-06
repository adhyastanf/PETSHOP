'use client';

import { ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>Pesanan Saya</h1>

      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <ShoppingBag className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>Belum ada pesanan</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          Pesanan Anda akan muncul di sini setelah checkout.
        </p>
      </div>
    </div>
  );
}
