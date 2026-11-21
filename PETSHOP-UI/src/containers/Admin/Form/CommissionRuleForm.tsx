'use client';

import { FormSelectField, FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateCommissionRule } from '@/features/config/query';
import { commissionRuleFormSchema, EMPTY_COMMISSION_RULE_FORM, type CommissionRuleFormSchema } from '@/lib/schema/commission-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const TRANSACTION_TYPE_ITEMS = [
  { label: 'PRODUCT', value: 'PRODUCT' },
  { label: 'SERVICE', value: 'SERVICE' },
];

const COMMISSION_TYPE_ITEMS = [
  { label: 'PERCENTAGE', value: 'PERCENTAGE' },
  { label: 'FIXED', value: 'FIXED' },
];

function toIso(dateInput: string): string | null {
  if (!dateInput) return null;
  return new Date(dateInput).toISOString();
}

export default function CommissionRuleForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const createMutation = useCreateCommissionRule();
  const { control, handleSubmit, reset } = useForm<CommissionRuleFormSchema>({
    resolver: zodResolver(commissionRuleFormSchema),
    defaultValues: EMPTY_COMMISSION_RULE_FORM,
  });

  function onSubmit(values: CommissionRuleFormSchema) {
    createMutation.mutate(
      {
        transactionType: values.transactionType,
        commissionType: values.commissionType,
        commissionValue: Number(values.commissionValue),
        priority: values.priority ? Number(values.priority) : 0,
        merchantId: values.merchantId.trim() || null,
        categoryId: values.categoryId.trim() || null,
        validFrom: toIso(values.validFrom),
        validUntil: toIso(values.validUntil),
      },
      {
        onSuccess: () => {
          toast.success(t('config.commission.createSuccess'));
          reset(EMPTY_COMMISSION_RULE_FORM);
          onClose();
        },
        onError: (error) => showApiError(error, t),
      },
    );
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <h2 className='font-medium'>{t('config.commission.createTitle')}</h2>
          <div className='grid gap-4 sm:grid-cols-2'>
            <FormSelectField control={control} name='transactionType' label={t('config.commission.transactionType')} items={TRANSACTION_TYPE_ITEMS} />
            <FormSelectField control={control} name='commissionType' label={t('config.commission.commissionType')} items={COMMISSION_TYPE_ITEMS} />
            <FormTextField control={control} name='commissionValue' label={t('config.commission.value')} type='number' step='0.01' min='0' />
            <FormTextField control={control} name='priority' label={t('config.commission.priority')} type='number' />
            <FormTextField control={control} name='merchantId' label={t('config.commission.merchantId')} />
            <FormTextField control={control} name='categoryId' label={t('config.commission.categoryId')} />
            <FormTextField control={control} name='validFrom' label={t('config.commission.validFrom')} type='date' />
            <FormTextField control={control} name='validUntil' label={t('config.commission.validUntil')} type='date' />
          </div>
          <p className='text-xs text-muted-foreground'>{t('config.commission.targetHint')}</p>
          <div className='flex gap-2'>
            <Button type='submit' loading={createMutation.isPending}>
              {t('config.common.create')}
            </Button>
            <Button type='button' variant='outline' onClick={onClose}>
              {t('config.common.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
