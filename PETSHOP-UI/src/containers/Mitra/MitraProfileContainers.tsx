'use client';

import { PageError, PageLoading } from '@/components/feedback/PageState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchantProfile } from '@/features/merchant/query';
import { useMe } from '@/hooks/use-auth';
import { useTranslations } from 'next-intl';
import MerchantProfileForm from './Form/MerchantProfileForm';

export default function MitraProfileContainers() {
  const t = useTranslations();
  const { data: user } = useMe();
  const { data: profile, isLoading, isError, error } = useMerchantProfile();

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('merchant.profile.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{profile?.businessName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isOwner ? t('merchant.profile.edit') : t('merchant.profile.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MerchantProfileForm profile={profile} isOwner={isOwner} />
        </CardContent>
      </Card>
    </div>
  );
}
