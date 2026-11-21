'use client';

import { FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { useVerifyVet } from '@/features/merchant/query';
import { vetVerificationSchema, type VetVerificationSchema } from '@/lib/schema/merchant-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Veterinarian verification statuses are PENDING / VERIFIED / REJECTED / EXPIRED
// (FEATURE_KNOWLEDGE.md §10). The backend rejects any other decision value.
type VetDecision = 'VERIFIED' | 'REJECTED';

/** Admin approve/reject panel for one veterinarian. */
export default function VetDecisionPanel({ staffId, onDone }: { staffId: string; onDone: () => void }) {
  const t = useTranslations();
  const verifyMutation = useVerifyVet();
  const { control, handleSubmit } = useForm<VetVerificationSchema>({
    resolver: zodResolver(vetVerificationSchema),
    defaultValues: { notes: '' },
  });

  function submitWith(decision: VetDecision) {
    return handleSubmit((values) => {
      verifyMutation.mutate(
        { staffId, data: { decision, notes: values.notes || undefined } },
        {
          onSuccess: () => {
            toast.success(t('merchant.verification.vetDecisionSuccess', { status: t(`merchant.status.${decision}`) }));
            onDone();
          },
          onError: (err) => showApiError(err, t),
        },
      );
    });
  }

  return (
    <div className='mt-4 space-y-3 border-t pt-4'>
      <FormTextField control={control} name='notes' label={t('merchant.verification.notes')} />
      <div className='flex gap-2'>
        <Button type='button' size='sm' onClick={submitWith('VERIFIED')} loading={verifyMutation.isPending}>
          {t('merchant.verification.approve')}
        </Button>
        <Button type='button' size='sm' variant='destructive' onClick={submitWith('REJECTED')} loading={verifyMutation.isPending}>
          {t('merchant.verification.reject')}
        </Button>
      </div>
    </div>
  );
}
