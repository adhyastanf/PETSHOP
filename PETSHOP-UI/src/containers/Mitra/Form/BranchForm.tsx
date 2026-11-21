'use client';

import { FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { useCreateBranch, useUpdateBranch } from '@/features/merchant/query';
import type { Branch } from '@/features/merchant/types';
import { useRouter } from '@/lib/i18n/navigation';
import { branchFormSchema, EMPTY_BRANCH_FORM, type BranchFormSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type BranchFormProps = {
  /** `create`: add a branch from the list page. `setup`: first-branch onboarding. `edit`: update an existing branch. */
  variant: 'create' | 'setup' | 'edit';
  branch?: Branch;
  onDone?: () => void;
  onCancel?: () => void;
};

export default function BranchForm({ variant, branch, onDone, onCancel }: BranchFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();

  const editValues = useMemo<BranchFormSchema | undefined>(
    () =>
      branch
        ? {
            ...EMPTY_BRANCH_FORM,
            name: branch.name,
            phoneNumber: branch.phoneNumber ?? '',
            email: branch.email ?? '',
            addressLine: branch.addressLine ?? '',
            isActive: branch.isActive,
          }
        : undefined,
    [branch],
  );

  const { control, handleSubmit, reset } = useForm<BranchFormSchema>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: EMPTY_BRANCH_FORM,
    values: editValues,
  });

  function onSubmit(values: BranchFormSchema) {
    if (variant === 'edit' && branch) {
      updateMutation.mutate(
        { id: branch.id, data: { name: values.name, phoneNumber: values.phoneNumber, email: values.email, addressLine: values.addressLine, isActive: values.isActive } },
        {
          onSuccess: () => toast.success(t('merchant.branch.edit')),
          onError: (err) => showApiError(err, t),
        },
      );
      return;
    }

    if (variant === 'setup') {
      createMutation.mutate(
        {
          name: values.name,
          phoneNumber: values.phoneNumber,
          email: values.email,
          provinceName: values.provinceName,
          cityName: values.cityName,
          districtName: values.districtName,
          postalCode: values.postalCode,
          addressLine: values.addressLine,
        },
        {
          onSuccess: () => {
            toast.success(t('merchant.setup.success'));
            router.push('/mitra');
          },
          onError: (err) => showApiError(err, t),
        },
      );
      return;
    }

    createMutation.mutate(
      { name: values.name, phoneNumber: values.phoneNumber, email: values.email, addressLine: values.addressLine },
      {
        onSuccess: () => {
          toast.success(t('merchant.branch.create'));
          reset(EMPTY_BRANCH_FORM);
          onDone?.();
        },
        onError: (err) => showApiError(err, t),
      },
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {variant === 'setup' ? (
        <>
          <FormTextField control={control} name='name' label={t('merchant.branch.name')} required placeholder={t('merchant.setup.namePlaceholder')} />
          <div className='grid gap-4 md:grid-cols-2'>
            <FormTextField control={control} name='phoneNumber' label={t('merchant.branch.phone')} />
            <FormTextField control={control} name='email' label={t('merchant.branch.email')} type='email' />
          </div>
          <FormTextField control={control} name='addressLine' label={t('merchant.branch.address')} placeholder={t('merchant.setup.addressPlaceholder')} />
          <div className='grid gap-4 md:grid-cols-2'>
            <FormTextField control={control} name='cityName' label={t('merchant.setup.city')} />
            <FormTextField control={control} name='postalCode' label={t('merchant.setup.postalCode')} />
          </div>
          <Button type='submit' className='w-full' loading={isPending}>
            {t('merchant.setup.submit')}
          </Button>
        </>
      ) : (
        <>
          <div className='grid gap-4 md:grid-cols-2'>
            <FormTextField control={control} name='name' label={t('merchant.branch.name')} required={variant === 'create'} />
            <FormTextField control={control} name='phoneNumber' label={t('merchant.branch.phone')} />
            <FormTextField control={control} name='email' label={t('merchant.branch.email')} type='email' />
            {variant === 'edit' && <FormTextField control={control} name='addressLine' label={t('merchant.branch.address')} />}
          </div>
          {variant === 'create' && <FormTextField control={control} name='addressLine' label={t('merchant.branch.address')} />}

          {variant === 'edit' && (
            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <Field orientation='horizontal'>
                  <Checkbox id='branch-is-active' checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                  <FieldLabel htmlFor='branch-is-active'>{t('common.active')}</FieldLabel>
                </Field>
              )}
            />
          )}

          <div className='flex gap-2'>
            <Button type='submit' loading={isPending}>
              {variant === 'edit' ? t('merchant.branch.edit') : t('merchant.branch.create')}
            </Button>
            {variant === 'create' && (
              <Button type='button' variant='outline' onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </>
      )}
    </form>
  );
}
