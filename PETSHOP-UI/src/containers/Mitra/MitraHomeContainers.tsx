'use client';

import { LinkCardGrid } from '@/components/general/link-card-grid';
import { Building2, Store, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function MitraHomeContainers() {
  const t = useTranslations();

  const links = [
    { href: '/mitra/profile', icon: Store, label: t('merchant.profile.title') },
    { href: '/mitra/branches', icon: Building2, label: t('merchant.branch.title') },
    { href: '/mitra/staff', icon: Users, label: t('merchant.staff.title') },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('common.home')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('dashboard.merchantSubtitle')}</p>
      </div>

      <LinkCardGrid links={links} />
    </div>
  );
}
