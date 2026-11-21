'use client';

import { FormTextField, FormTextareaField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { useApplyMerchant } from '@/features/merchant/query';
import { useRouter } from '@/lib/i18n/navigation';
import { EMPTY_MERCHANT_APPLY, merchantApplySchema, type MerchantApplySchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function MerchantApplyForm() {
  const t = useTranslations();
  const router = useRouter();
  const applyMutation = useApplyMerchant();
  const { control, handleSubmit } = useForm<MerchantApplySchema>({
    resolver: zodResolver(merchantApplySchema),
    defaultValues: EMPTY_MERCHANT_APPLY,
  });

  function onSubmit(values: MerchantApplySchema) {
    applyMutation.mutate(values, {
      onSuccess: () => {
        toast.success(t('merchant.application.submitted'));
        router.push('/customer/merchant-status');
      },
      onError: (error) => showApiError(error, t),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormTextField control={control} name='businessName' label={t('merchant.application.businessName')} required />
        <FormTextField control={control} name='displayName' label={t('merchant.application.displayName')} />
        <FormTextField control={control} name='email' label={t('merchant.application.email')} type='email' />
        <FormTextField control={control} name='phoneNumber' label={t('merchant.application.phone')} />
        <FormTextField control={control} name='whatsappNumber' label={t('merchant.application.whatsapp')} />
        <FormTextField control={control} name='nib' label={t('merchant.application.nib')} />
        <FormTextField control={control} name='npwp' label={t('merchant.application.npwp')} />
      </div>
      <FormTextareaField control={control} name='description' label={t('merchant.application.businessDescription')} />
      <Button type='submit' loading={applyMutation.isPending}>
        {t('merchant.application.submit')}
      </Button>
    </form>
  );
}
