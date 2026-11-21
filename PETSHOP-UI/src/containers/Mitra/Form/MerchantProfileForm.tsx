'use client';

import { FormTextField, FormTextareaField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { useUpdateMerchantProfile } from '@/features/merchant/query';
import type { MerchantProfile } from '@/features/merchant/types';
import { EMPTY_MERCHANT_PROFILE, merchantProfileSchema, type MerchantProfileSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/** Merchant profile form. Read-only for non-owner roles. */
export default function MerchantProfileForm({ profile, isOwner }: { profile?: MerchantProfile; isOwner: boolean }) {
  const t = useTranslations();
  const updateMutation = useUpdateMerchantProfile();

  const values = useMemo<MerchantProfileSchema | undefined>(
    () =>
      profile
        ? {
            displayName: profile.displayName ?? '',
            description: profile.description ?? '',
            email: profile.email ?? '',
            phoneNumber: profile.phoneNumber ?? '',
            whatsappNumber: profile.whatsappNumber ?? '',
          }
        : undefined,
    [profile],
  );

  const { control, handleSubmit } = useForm<MerchantProfileSchema>({
    resolver: zodResolver(merchantProfileSchema),
    defaultValues: EMPTY_MERCHANT_PROFILE,
    values,
  });

  function onSubmit(data: MerchantProfileSchema) {
    updateMutation.mutate(data, {
      onSuccess: () => toast.success(t('merchant.profile.save')),
      onError: (err) => showApiError(err, t),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormTextField control={control} name='displayName' label={t('merchant.application.displayName')} disabled={!isOwner} />
        <FormTextField control={control} name='email' label={t('merchant.application.email')} type='email' disabled={!isOwner} />
        <FormTextField control={control} name='phoneNumber' label={t('merchant.application.phone')} disabled={!isOwner} />
        <FormTextField control={control} name='whatsappNumber' label={t('merchant.application.whatsapp')} disabled={!isOwner} />
      </div>
      <FormTextareaField control={control} name='description' label={t('merchant.application.businessDescription')} disabled={!isOwner} />
      {isOwner && (
        <Button type='submit' loading={updateMutation.isPending}>
          {t('merchant.profile.save')}
        </Button>
      )}
    </form>
  );
}
