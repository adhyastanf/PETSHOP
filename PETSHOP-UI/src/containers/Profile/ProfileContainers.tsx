'use client';

import { Edit3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FormProfile from './Form/ProfileForm';

export default function ProfileContainers() {
  const t = useTranslations();

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 border-gray-100'>
        <div className='p-3 bg-blue-50 text-blue-600 rounded'>
          <Edit3 className='size-5' />
        </div>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>{t('customer.profile.title')}</h2>
          <p className='text-xs text-gray-500'>Kelola informasi profil dan data pribadi Anda</p>
        </div>
      </div>
      <FormProfile />
    </div>
  );
}
