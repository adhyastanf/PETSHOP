'use client';

import { LinkCardGrid } from '@/components/general/link-card-grid';
import { Stethoscope, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminDashboardContainers() {
  const t = useTranslations();

  const links = [
    { href: '/admin/merchants', icon: Store, label: t('merchant.verification.title') },
    { href: '/admin/veterinarians', icon: Stethoscope, label: t('merchant.verification.vetTitle') },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('dashboard.adminTitle')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('dashboard.adminSubtitle')}</p>
      </div>

      <LinkCardGrid links={links} />
    </div>
  );
}
