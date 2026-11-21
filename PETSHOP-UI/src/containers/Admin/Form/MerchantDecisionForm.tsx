'use client';

import { FormSelectField, FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { useVerifyMerchant } from '@/features/merchant/query';
import { merchantVerificationSchema, type MerchantVerificationSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/** Admin decision form for one merchant application. */
export default function MerchantDecisionForm({ merchantId, onDone }: { merchantId: string; onDone: () => void }) {
  const t = useTranslations();
  const verifyMutation = useVerifyMerchant();
  const { control, handleSubmit } = useForm<MerchantVerificationSchema>({
    resolver: zodResolver(merchantVerificationSchema),
    defaultValues: { decision: '', notes: '' },
  });

  const decisionItems = [
    { label: t('merchant.verification.approve'), value: 'APPROVED' },
    { label: t('merchant.status.UNDER_REVIEW'), value: 'UNDER_REVIEW' },
    { label: t('merchant.verification.reject'), value: 'REJECTED' },
  ];

  function onSubmit(values: MerchantVerificationSchema) {
    verifyMutation.mutate(
      { merchantId, data: { decision: values.decision, notes: values.notes || undefined } },
      {
        onSuccess: () => {
          toast.success(t('merchant.verification.merchantDecisionSuccess', { status: t(`merchant.status.${values.decision}`) }));
          onDone();
        },
        onError: (err) => showApiError(err, t),
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='mt-4 space-y-3 border-t pt-4'>
      <FormSelectField control={control} name='decision' label={t('merchant.verification.decision')} items={decisionItems} placeholder={t('merchant.verification.selectDecision')} />
      <FormTextField control={control} name='notes' label={t('merchant.verification.notes')} />
      <Button type='submit' loading={verifyMutation.isPending}>
        {t('merchant.verification.submit')}
      </Button>
    </form>
  );
}
