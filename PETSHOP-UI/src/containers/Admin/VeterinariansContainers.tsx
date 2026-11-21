'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAllVeterinarians } from '@/features/merchant/query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import VetDecisionPanel from './Form/VetDecisionPanel';

const VET_ROLE_CODES = ['VET', 'VETERINARIAN'];

export default function VeterinariansContainers() {
  const t = useTranslations();
  const { data: staff, isLoading, isError, error } = useAllVeterinarians();
  const [actionId, setActionId] = useState<string | null>(null);

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  // Show only veterinarian-role staff.
  const vetStaff = staff?.filter((s) => VET_ROLE_CODES.includes(s.roleCode)) ?? [];

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{t('merchant.verification.vetTitle')}</h1>

      {vetStaff.length === 0 ? (
        <PageEmpty message={t('merchant.verification.noVets')} />
      ) : (
        <div className='space-y-3'>
          {vetStaff.map((vet) => (
            <Card key={vet.id}>
              <CardContent>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='font-medium'>{vet.displayName || vet.userFullName}</h2>
                    <p className='text-sm text-muted-foreground'>
                      {vet.roleName} {vet.employeeCode ? `· ${vet.employeeCode}` : ''}
                    </p>
                    <p className='text-xs text-muted-foreground'>{vet.status}</p>
                  </div>
                  <Button size='sm' onClick={() => setActionId(actionId === vet.id ? null : vet.id)}>
                    {t('merchant.verification.verify')}
                  </Button>
                </div>

                {actionId === vet.id && <VetDecisionPanel staffId={vet.id} onDone={() => setActionId(null)} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
