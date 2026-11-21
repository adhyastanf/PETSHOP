'use client';

import { FormSelectField, FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { useAddStaff } from '@/features/merchant/query';
import { EMPTY_STAFF_FORM, staffFormSchema, type StaffFormSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const STAFF_ROLE_CODES = ['PETSHOP_ADMIN', 'PETSHOP_STAFF', 'GROOMER', 'VETERINARIAN'];

export default function StaffForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const t = useTranslations();
  const addMutation = useAddStaff();
  const { control, handleSubmit, reset } = useForm<StaffFormSchema>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: EMPTY_STAFF_FORM,
  });

  const roleItems = STAFF_ROLE_CODES.map((code) => ({ label: t(`merchant.staff.roles.${code}`), value: code }));

  function onSubmit(values: StaffFormSchema) {
    addMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t('merchant.staff.add'));
        reset(EMPTY_STAFF_FORM);
        onDone();
      },
      onError: (err) => showApiError(err, t),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormTextField control={control} name='email' label={t('merchant.staff.email')} type='email' required />
        <FormSelectField control={control} name='roleCode' label={t('merchant.staff.role')} items={roleItems} placeholder={t('merchant.staff.selectRole')} required />
        <FormTextField control={control} name='employeeCode' label={t('merchant.staff.employeeCode')} />
        <FormTextField control={control} name='displayName' label={t('merchant.staff.displayName')} />
      </div>
      <div className='flex gap-2'>
        <Button type='submit' loading={addMutation.isPending}>
          {t('merchant.staff.add')}
        </Button>
        <Button type='button' variant='outline' onClick={onCancel}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
