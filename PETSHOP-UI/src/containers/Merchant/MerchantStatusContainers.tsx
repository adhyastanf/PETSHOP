'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { MerchantStatusBadge } from '@/components/general/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { useMyApplications } from '@/features/merchant/query';
import { useTranslations } from 'next-intl';

export default function MerchantStatusContainers() {
  const t = useTranslations();
  const { data: applications, isLoading, isError, error } = useMyApplications();

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('merchant.application.status')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('merchant.application.myApplications')}</p>
      </div>

      {!applications || applications.length === 0 ? (
        <PageEmpty message={t('merchant.application.noApplications')} />
      ) : (
        <div className='space-y-3'>
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent>
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='font-medium'>{app.businessName}</h2>
                    {app.displayName && <p className='text-sm text-muted-foreground'>{app.displayName}</p>}
                    <p className='text-xs text-muted-foreground'>{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <MerchantStatusBadge status={app.verificationStatus} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
