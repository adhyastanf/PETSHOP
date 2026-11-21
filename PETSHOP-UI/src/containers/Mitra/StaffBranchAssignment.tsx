'use client';

import FormSelect from '@/components/Input/FormSelect';
import { Button } from '@/components/ui/button';
import { useAssignStaffBranch, useBranches, useRemoveStaffBranch, useStaffBranches } from '@/features/merchant/query';
import { showApiError } from '@/utils/show-api-error';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

/** Branch assignments for one staff member. Only owners can change them. */
export default function StaffBranchAssignment({ staffId, isOwner }: { staffId: string; isOwner: boolean }) {
  const t = useTranslations();
  const { data: staffBranches, isLoading } = useStaffBranches(staffId);
  const { data: allBranches } = useBranches();
  const assignMutation = useAssignStaffBranch();
  const removeMutation = useRemoveStaffBranch();
  const [selectedBranch, setSelectedBranch] = useState('');

  function handleAssign() {
    if (!selectedBranch) return;
    assignMutation.mutate(
      { staffId, data: { branchId: selectedBranch } },
      {
        onSuccess: () => {
          setSelectedBranch('');
          toast.success(t('merchant.staff.assignBranch'));
        },
        onError: (err) => showApiError(err, t),
      },
    );
  }

  if (isLoading) {
    return <div className='text-xs text-muted-foreground'>{t('common.loading')}</div>;
  }

  const assignedIds = new Set(staffBranches?.map((sb) => sb.branchId) ?? []);
  const unassigned = allBranches?.filter((b) => !assignedIds.has(b.id)) ?? [];

  return (
    <div className='mt-3 space-y-2'>
      <p className='text-xs font-medium text-muted-foreground'>{t('merchant.staff.branches')}</p>
      {!staffBranches || staffBranches.length === 0 ? (
        <p className='text-xs text-muted-foreground'>{t('merchant.staff.noBranches')}</p>
      ) : (
        <div className='flex flex-wrap gap-1.5'>
          {staffBranches.map((sb) => (
            <span key={sb.branchId} className='inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs'>
              {sb.branchName}
              {isOwner && (
                <button
                  type='button'
                  className='text-muted-foreground hover:text-destructive'
                  onClick={() => removeMutation.mutate({ staffId, branchId: sb.branchId }, { onError: (err) => showApiError(err, t) })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {isOwner && unassigned.length > 0 && (
        <div className='flex items-center gap-2'>
          <FormSelect<string>
            items={unassigned.map((b) => ({ label: b.name, value: b.id }))}
            value={selectedBranch}
            onValueChange={(value) => setSelectedBranch(value ?? '')}
            placeholder={t('merchant.staff.assignBranch')}
          />
          <Button size='xs' onClick={handleAssign} loading={assignMutation.isPending} disabled={!selectedBranch}>
            <Plus className='size-3' />
          </Button>
        </div>
      )}
    </div>
  );
}
