'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { ActiveBadge } from '@/components/general/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBranches } from '@/features/merchant/query';
import { useMe } from '@/hooks/use-auth';
import { Link } from '@/lib/i18n/navigation';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import BranchForm from './Form/BranchForm';

export default function BranchesContainers() {
  const t = useTranslations();
  const { data: user } = useMe();
  const { data: branches, isLoading, isError, error } = useBranches();
  const [showForm, setShowForm] = useState(false);

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{t('merchant.branch.title')}</h1>
        {isOwner && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className='size-4' />
            {t('merchant.branch.create')}
          </Button>
        )}
      </div>

      {isOwner && showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('merchant.branch.create')}</CardTitle>
          </CardHeader>
          <CardContent>
            <BranchForm variant='create' onDone={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {!branches || branches.length === 0 ? (
        <PageEmpty message={t('merchant.branch.noBranches')} />
      ) : (
        <div className='grid gap-3 md:grid-cols-2'>
          {branches.map((branch) => (
            <Link key={branch.id} href={`/mitra/branches/${branch.id}`}>
              <Card className='cursor-pointer transition-colors hover:bg-muted/50'>
                <CardContent>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h2 className='font-medium'>{branch.name}</h2>
                      <p className='text-sm text-muted-foreground'>{branch.code}</p>
                      {branch.addressLine && <p className='mt-1 text-xs text-muted-foreground'>{branch.addressLine}</p>}
                    </div>
                    <ActiveBadge active={branch.isActive} activeLabel={t('common.active')} inactiveLabel={t('common.inactive')} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
