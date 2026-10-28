'use client';

import { Heart } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function WishlistPage() {
  const { t } = useI18n();

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{t('customer.wishlist.title')}</h1>

      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Heart className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>{t('customer.wishlist.empty')}</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('customer.wishlist.emptyDescription')}
        </p>
      </div>
    </div>
  );
}
