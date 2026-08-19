'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBranch, useUpdateBranch, useBranchHours, useSetBranchHours } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';
import type { UpdateBranchRequest, DayHours } from '@/features/merchant/types';

const DEFAULT_HOURS: DayHours[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i + 1,
  openTime: '08:00',
  closeTime: '17:00',
  isClosed: false,
}));

export default function MitraBranchDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const branchId = params.id as string;
  const { data: branch, isLoading, isError, error } = useBranch(branchId);
  const { data: branchHours, isLoading: hoursLoading } = useBranchHours(branchId);
  const updateMutation = useUpdateBranch();
  const setHoursMutation = useSetBranchHours();

  const [form, setForm] = useState<UpdateBranchRequest>({
    name: '',
    phoneNumber: '',
    email: '',
    addressLine: '',
  });

  const [hours, setHours] = useState<DayHours[]>(DEFAULT_HOURS);

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        phoneNumber: branch.phoneNumber ?? '',
        email: branch.email ?? '',
        addressLine: branch.addressLine ?? '',
        isActive: branch.isActive,
      });
    }
  }, [branch]);

  useEffect(() => {
    if (branchHours?.hours?.length) {
      setHours(branchHours.hours);
    }
  }, [branchHours]);

  function handleUpdateBranch(e: FormEvent) {
    e.preventDefault();
    updateMutation.mutate(
      { id: branchId, data: form },
      {
        onSuccess: () => toast.success(t('merchant.branch.edit')),
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

  function handleSaveHours() {
    setHoursMutation.mutate(
      { branchId, hours },
      {
        onSuccess: () => toast.success(t('merchant.branch.hours')),
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

  function updateHour(dayOfWeek: number, field: keyof DayHours, value: string | boolean) {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h))
    );
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
      <h1 className="text-2xl font-semibold">{branch?.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t('merchant.branch.edit')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateBranch} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.name')}</Label>
                <Input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.phone')}</Label>
                <Input value={form.phoneNumber ?? ''} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.email')}</Label>
                <Input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.address')}</Label>
                <Input value={form.addressLine ?? ''} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Active
            </label>
            <Button type="submit" loading={updateMutation.isPending}>{t('merchant.branch.edit')}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('merchant.branch.hours')}</CardTitle>
        </CardHeader>
        <CardContent>
          {hoursLoading ? (
            <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
          ) : (
            <div className="space-y-3">
              {hours.map((day) => (
                <div key={day.dayOfWeek} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium">{t(`merchant.days.${day.dayOfWeek}`)}</span>
                  <label className="flex items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={day.isClosed}
                      onChange={(e) => updateHour(day.dayOfWeek, 'isClosed', e.target.checked)}
                    />
                    {t('merchant.branch.closed')}
                  </label>
                  {!day.isClosed && (
                    <>
                      <Input
                        type="time"
                        className="w-32"
                        value={day.openTime ?? ''}
                        onChange={(e) => updateHour(day.dayOfWeek, 'openTime', e.target.value)}
                      />
                      <span className="text-sm">-</span>
                      <Input
                        type="time"
                        className="w-32"
                        value={day.closeTime ?? ''}
                        onChange={(e) => updateHour(day.dayOfWeek, 'closeTime', e.target.value)}
                      />
                    </>
                  )}
                </div>
              ))}
              <Button onClick={handleSaveHours} loading={setHoursMutation.isPending}>
                {t('merchant.branch.hours')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
