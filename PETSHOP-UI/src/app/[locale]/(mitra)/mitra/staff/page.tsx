'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import {
  useStaff,
  useAddStaff,
  useDeleteStaff,
  useBranches,
  useStaffBranches,
  useAssignStaffBranch,
  useRemoveStaffBranch,
} from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';
import type { AddStaffRequest } from '@/features/merchant/types';

const emptyStaff: AddStaffRequest = {
  email: '',
  roleCode: '',
  employeeCode: '',
  displayName: '',
};

function StaffBranchAssignment({ staffId, isOwner }: { staffId: string; isOwner: boolean }) {
  const { t } = useI18n();
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
        onError: (err) => {
          if (err instanceof ApiError) {
            toast.error(err.message);
          } else {
            toast.error(t('common.networkError'));
          }
        },
      }
    );
  }

  if (isLoading) {
    return <div className="text-xs text-muted-foreground">{t('common.loading')}</div>;
  }

  const assignedIds = new Set(staffBranches?.map((sb) => sb.branchId) ?? []);
  const unassigned = allBranches?.filter((b) => !assignedIds.has(b.id)) ?? [];

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{t('merchant.staff.branches')}</p>
      {(!staffBranches || staffBranches.length === 0) ? (
        <p className="text-xs text-muted-foreground">{t('merchant.staff.noBranches')}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {staffBranches.map((sb) => (
            <span key={sb.branchId} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">
              {sb.branchName}
              {isOwner && (
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeMutation.mutate({ staffId, branchId: sb.branchId })}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {isOwner && unassigned.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            className="h-7 rounded-lg border bg-background px-2 text-xs"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">{t('merchant.staff.assignBranch')}</option>
            {unassigned.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <Button size="xs" onClick={handleAssign} loading={assignMutation.isPending} disabled={!selectedBranch}>
            <Plus className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function MitraStaffPage() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const { data: staff, isLoading, isError, error } = useStaff();
  const addMutation = useAddStaff();
  const deleteMutation = useDeleteStaff();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddStaffRequest>(emptyStaff);
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    addMutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('merchant.staff.add'));
        setForm(emptyStaff);
        setShowForm(false);
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error(t('common.networkError'));
        }
      },
    });
  }

  if (isLoading) {
    return <div className="py-10 text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        {error instanceof Error ? error.message : t('common.unknownError')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('merchant.staff.title')}</h1>
        {isOwner && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="size-4" />
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{t('merchant.staff.email')} *</Label>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('merchant.staff.role')} *</Label>
                  <select
                    className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                    required
                    value={form.roleCode}
                    onChange={(e) => setForm({ ...form, roleCode: e.target.value })}
                  >
                    <option value="">-- Select Role --</option>
                    <option value="PETSHOP_ADMIN">Petshop Admin</option>
                    <option value="PETSHOP_STAFF">Petshop Staff</option>
                    <option value="GROOMER">Groomer</option>
                    <option value="VETERINARIAN">Veterinarian</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('merchant.staff.employeeCode')}</Label>
                  <Input value={form.employeeCode ?? ''} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>{t('merchant.staff.displayName')}</Label>
                  <Input value={form.displayName ?? ''} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" loading={addMutation.isPending}>{t('merchant.staff.add')}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!staff || staff.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('merchant.staff.noStaff')}
        </div>
      ) : (
        <div className="space-y-3">
          {staff.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div
                    className="cursor-pointer"
                    onClick={() => setExpandedStaffId(expandedStaffId === member.id ? null : member.id)}
                  >
                    <h2 className="font-medium">{member.displayName || member.userFullName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {member.roleName} {member.employeeCode ? `· ${member.employeeCode}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.status}</p>
                  </div>
                  {isOwner && (
                    <ConfirmDialog
                      title={t('merchant.staff.deleteConfirm')}
                      description={member.displayName || member.userFullName}
                      onConfirm={() => deleteMutation.mutate(member.id, {
                        onError: (err) => {
                          if (err instanceof ApiError) {
                            toast.error(err.message);
                          } else {
                            toast.error(t('common.networkError'));
                          }
                        },
                      })}
                      loading={deleteMutation.isPending}
                    >
                      {(open) => (
                        <Button type="button" size="icon" variant="destructive" onClick={open}>
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </ConfirmDialog>
                  )}
                </div>
                {expandedStaffId === member.id && (
                  <StaffBranchAssignment staffId={member.id} isOwner={isOwner} />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
