'use client';

import { Heart } from 'lucide-react';

export default function WishlistPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>Wishlist</h1>

      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Heart className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>Wishlist kosong</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          Simpan produk favorit Anda di sini.
        </p>
      </div>
    </div>
  );
}
