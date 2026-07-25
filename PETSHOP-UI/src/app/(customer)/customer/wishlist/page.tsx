'use client';

import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function WishlistPage() {
  return (
    <main className='py-10 px-4'>
      <div className='max-w-3xl mx-auto space-y-6'>
        <h1 className='text-2xl font-semibold'>Wishlist</h1>

        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <Heart className='size-12 text-muted-foreground/40' />
            <p className='mt-4 text-lg font-medium'>Wishlist kosong</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              Simpan produk favorit Anda di sini.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
