'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import BranchForm from './Form/BranchForm';

/** First-branch onboarding for a newly approved merchant owner. */
export default function SetupContainers() {
  const t = useTranslations();

  return (
    <div className='flex min-h-[60vh] items-center justify-center p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <Store className='mx-auto size-10 text-primary' />
          <CardTitle className='mt-2'>{t('merchant.setup.title')}</CardTitle>
          <CardDescription>{t('merchant.setup.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <BranchForm variant='setup' />
        </CardContent>
      </Card>
    </div>
  );
}
