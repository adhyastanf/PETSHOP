'use client';

import { PageLoading } from '@/components/feedback/PageState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMyApplications } from '@/features/merchant/query';
import { Link } from '@/lib/i18n/navigation';
import { Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MerchantApplyForm from './Form/MerchantApplyForm';

export default function MerchantApplyContainers() {
  const t = useTranslations();
  const { data: applications, isLoading } = useMyApplications();

  if (isLoading) return <PageLoading />;

  // If the user already has an application, show its status instead of the form.
  if (applications && applications.length > 0) {
    const app = applications[0];
    return (
      <div className='space-y-6'>
        <h1 className='text-2xl font-semibold'>{t('merchant.application.title')}</h1>
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
            <Store className='size-12 text-muted-foreground/40' />
            <p className='mt-4 text-lg font-medium'>{t('merchant.application.submitted')}</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              {app.businessName} — {t(`merchant.status.${app.verificationStatus}`)}
            </p>
            <Link href='/customer/merchant-status' className='mt-4'>
              <Button variant='outline'>{t('merchant.application.status')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{t('merchant.application.title')}</h1>
      <p className='text-sm text-muted-foreground'>{t('merchant.application.description')}</p>
      <Card>
        <CardContent>
          <MerchantApplyForm />
        </CardContent>
      </Card>
    </div>
  );
}
