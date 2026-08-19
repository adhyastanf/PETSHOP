'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAllVeterinarians, useVerifyVet } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';

export default function AdminVeterinariansPage() {
  const { t } = useI18n();
  const { data: staff, isLoading, isError, error } = useAllVeterinarians();
  const verifyMutation = useVerifyVet();
  const [actionId, setActionId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  function handleDecision(staffId: string, decision: string) {
    verifyMutation.mutate(
      { staffId, data: { decision, notes: notes || undefined } },
      {
        onSuccess: () => {
          toast.success(`${t('merchant.verification.vetTitle')} - ${decision}`);
          setActionId(null);
          setNotes('');
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
    return <div className="py-10 text-sm text-muted-foreground">{t('common.loading')}</div>;
  }

  if (isError) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        {error instanceof Error ? error.message : t('common.unknownError')}
      </div>
    );
  }

  // Filter to show only vet role staff
  const vetStaff = staff?.filter((s) => s.roleCode === 'VET' || s.roleCode === 'VETERINARIAN') ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('merchant.verification.vetTitle')}</h1>

      {vetStaff.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('merchant.verification.noVets')}
        </div>
      ) : (
        <div className="space-y-3">
          {vetStaff.map((vet) => (
            <Card key={vet.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medium">{vet.displayName || vet.userFullName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {vet.roleName} {vet.employeeCode ? `· ${vet.employeeCode}` : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">{vet.status}</p>
                  </div>
                  <Button size="sm" onClick={() => setActionId(actionId === vet.id ? null : vet.id)}>
                    {t('merchant.verification.verify')}
                  </Button>
                </div>

                {actionId === vet.id && (
                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label>{t('merchant.verification.notes')}</Label>
                      <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDecision(vet.id, 'APPROVED')}
                        loading={verifyMutation.isPending}
                      >
                        {t('merchant.verification.approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecision(vet.id, 'REJECTED')}
                        loading={verifyMutation.isPending}
                      >
                        {t('merchant.verification.reject')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
