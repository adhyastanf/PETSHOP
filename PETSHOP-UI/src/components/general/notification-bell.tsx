'use client';

import { Bell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function IconButtonNotificationBell() {
  const t = useTranslations('common');
  
  return (
    <Button type='button' variant='outline' size='icon' aria-label={t('notifications')} className='relative'>
      <Bell aria-hidden='true' />
    </Button>
  );
}
