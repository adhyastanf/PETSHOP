'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { MerchantStatusBadge } from '@/components/general/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAllApplications } from '@/features/merchant/query';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import MerchantDecisionForm from './Form/MerchantDecisionForm';

const DECIDABLE_STATUSES = ['SUBMITTED', 'UNDER_REVIEW'];

export default function MerchantVerificationContainers() {
  const t = useTranslations();
  const { data: applications, isLoading, isError, error } = useAllApplications();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{t('merchant.verification.title')}</h1>

      {!applications || applications.length === 0 ? (
        <PageEmpty message={t('merchant.application.noApplications')} />
      ) : (
        <div className='space-y-3'>
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='font-medium'>{app.businessName}</h2>
                    {app.displayName && <p className='text-sm text-muted-foreground'>{app.displayName}</p>}
                    <p className='text-xs text-muted-foreground'>{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MerchantStatusBadge status={app.verificationStatus} />
                    {DECIDABLE_STATUSES.includes(app.verificationStatus) && (
                      <button type='button' onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className='flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted'>
                        {t('merchant.verification.decision')}
                        <ChevronDown className={`size-3 transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === app.id && <MerchantDecisionForm merchantId={app.id} onDone={() => setExpandedId(null)} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
