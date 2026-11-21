'use client';

import { FormTextField } from '@/components/Input/FormField';
import { PageLoading } from '@/components/feedback/PageState';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useBranchHours, useSetBranchHours } from '@/features/merchant/query';
import type { DayHours } from '@/features/merchant/types';
import { branchHoursSchema, type BranchHoursSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const DEFAULT_HOURS: DayHours[] = Array.from({ length: 7 }, (_, i) => ({
  dayOfWeek: i + 1,
  openTime: '08:00',
  closeTime: '17:00',
  isClosed: false,
}));

export default function BranchHoursForm({ branchId }: { branchId: string }) {
  const t = useTranslations();
  const { data: branchHours, isLoading } = useBranchHours(branchId);
  const setHoursMutation = useSetBranchHours();

  const values = useMemo<BranchHoursSchema>(() => ({ hours: branchHours?.hours?.length ? branchHours.hours : DEFAULT_HOURS }), [branchHours]);

  const { control, handleSubmit } = useForm<BranchHoursSchema>({
    resolver: zodResolver(branchHoursSchema),
    defaultValues: { hours: DEFAULT_HOURS },
    values,
  });
  const { fields } = useFieldArray({ control, name: 'hours' });
  const hours = useWatch({ control, name: 'hours' });

  function onSubmit(data: BranchHoursSchema) {
    setHoursMutation.mutate(
      { branchId, hours: data.hours },
      {
        onSuccess: () => toast.success(t('merchant.branch.hours')),
        onError: (err) => showApiError(err, t),
      },
    );
  }

  if (isLoading) return <PageLoading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
      {fields.map((field, index) => {
        const isClosed = hours?.[index]?.isClosed ?? false;
        return (
          <div key={field.id} className='flex items-start gap-3'>
            <span className='w-24 pt-2 text-sm font-medium'>{t(`merchant.days.${field.dayOfWeek}`)}</span>
            <Controller
              name={`hours.${index}.isClosed` as const}
              control={control}
              render={({ field: closedField }) => (
                <label className='flex items-center gap-1.5 pt-2 text-sm'>
                  <Checkbox checked={closedField.value} onCheckedChange={(checked) => closedField.onChange(Boolean(checked))} />
                  {t('merchant.branch.closed')}
                </label>
              )}
            />
            {!isClosed && (
              <>
                <FormTextField control={control} name={`hours.${index}.openTime` as const} label={t('merchant.branch.openTime')} type='time' hideLabel className='w-32' />
                <span className='pt-2 text-sm'>-</span>
                <FormTextField control={control} name={`hours.${index}.closeTime` as const} label={t('merchant.branch.closeTime')} type='time' hideLabel className='w-32' />
              </>
            )}
          </div>
        );
      })}
      <Button type='submit' loading={setHoursMutation.isPending}>
        {t('merchant.branch.hours')}
      </Button>
    </form>
  );
}
