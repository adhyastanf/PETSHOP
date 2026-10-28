'use client';

import { ShieldX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

/**
 * 403 Forbidden — canonical empty/error state pattern.
 */
export default function Forbidden() {
  const { t } = useI18n();
  const router = useRouter();

  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4 text-center'>
      <ShieldX className='size-12 text-muted-foreground/40' />
      <h1 className='text-xl font-semibold'>{t('error.forbidden.title')}</h1>
      <p className='max-w-xs text-sm text-muted-foreground'>
        {t('error.forbidden.description')}
      </p>
      <div className='flex gap-2 mt-2'>
        <Button variant='outline' onClick={() => router.back()}>
          {t('common.back')}
        </Button>
        <Button onClick={() => router.push('/')}>
          {t('common.home')}
        </Button>
      </div>
    </div>
  );
}
