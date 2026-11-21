'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeleteStaff, useStaff } from '@/features/merchant/query';
import type { Staff } from '@/features/merchant/types';
import { useMe } from '@/hooks/use-auth';
import { alertDialog } from '@/lib/alert-dialog';
import { showApiError } from '@/utils/show-api-error';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import StaffForm from './Form/StaffForm';
import StaffBranchAssignment from './StaffBranchAssignment';

export default function StaffContainers() {
  const t = useTranslations();
  const { data: user } = useMe();
  const { data: staff, isLoading, isError, error } = useStaff();
  const deleteMutation = useDeleteStaff();
  const [showForm, setShowForm] = useState(false);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  function handleDelete(member: Staff) {
    alertDialog.confirm({
      title: t('merchant.staff.deleteConfirm'),
      description: member.displayName || member.userFullName,
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      onConfirm: () => deleteMutation.mutate(member.id, { onError: (err) => showApiError(err, t) }),
    });
  }

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{t('merchant.staff.title')}</h1>
        {isOwner && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className='size-4' />
            {t('merchant.staff.add')}
          </Button>
        )}
      </div>

      {isOwner && showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('merchant.staff.add')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StaffForm onDone={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      {!staff || staff.length === 0 ? (
        <PageEmpty message={t('merchant.staff.noStaff')} />
      ) : (
        <div className='space-y-3'>
          {staff.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <div className='flex items-start justify-between'>
                  <div className='cursor-pointer' onClick={() => setExpandedStaffId(expandedStaffId === member.id ? null : member.id)}>
                    <h2 className='font-medium'>{member.displayName || member.userFullName}</h2>
                    <p className='text-sm text-muted-foreground'>
                      {member.roleName} {member.employeeCode ? `· ${member.employeeCode}` : ''}
                    </p>
                    <p className='text-xs text-muted-foreground'>{member.status}</p>
                  </div>
                  {isOwner && (
                    <Button type='button' size='icon' variant='destructive' loading={deleteMutation.isPending && deleteMutation.variables === member.id} onClick={() => handleDelete(member)}>
                      <Trash2 className='size-4' />
                    </Button>
                  )}
                </div>
                {expandedStaffId === member.id && <StaffBranchAssignment staffId={member.id} isOwner={isOwner} />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
