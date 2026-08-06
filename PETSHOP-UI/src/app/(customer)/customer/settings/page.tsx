'use client';

import { Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{t('customer.settings.title')}</h1>

      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <Settings className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>{t('common.comingSoon')}</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          {t('customer.settings.comingSoon')}
        </p>
      </div>
    </div>
  );
}
