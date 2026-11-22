'use client';

import { Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FormProfile from './Form/ProfileForm';

export default function ProfileContainers() {
  const t = useTranslations();

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <div className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary'>
          <Edit3 className='size-5' />
        </div>
        <div>
          <h2 className='text-h3 text-foreground'>{t('customer.profile.title')}</h2>
          <p className='text-small text-muted-foreground'>{t('customer.profile.description')}</p>
        </div>
      </div>
      <FormProfile />
    </div>
  );
}
