'use client';

import { PageError, PageLoading } from '@/components/feedback/PageState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBranch } from '@/features/merchant/query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import BranchForm from './Form/BranchForm';
import BranchHoursForm from './Form/BranchHoursForm';

export default function BranchDetailContainers() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const branchId = params.id;
  const { data: branch, isLoading, isError, error } = useBranch(branchId);

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-semibold'>{branch?.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('merchant.branch.edit')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BranchForm variant='edit' branch={branch} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('merchant.branch.hours')}</CardTitle>
        </CardHeader>
        <CardContent>
          <BranchHoursForm branchId={branchId} />
        </CardContent>
      </Card>
    </div>
  );
}
