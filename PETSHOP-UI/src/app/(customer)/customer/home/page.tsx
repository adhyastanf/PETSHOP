'use client';

import { PawPrint } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function HomeCustomer() {
  const { t } = useI18n();

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('customer.home.welcome')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('customer.home.description')}
        </p>
      </div>

      {/* Placeholder — will be replaced with real content in later phases */}
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <PawPrint className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>{t('common.comingSoon')}</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('customer.home.productsComingSoon')}
        </p>
      </div>
    </div>
  );
}
