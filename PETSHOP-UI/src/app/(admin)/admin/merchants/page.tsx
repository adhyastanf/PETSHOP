'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAllApplications, useVerifyMerchant } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {t(`merchant.status.${status}`) || status}
    </span>
  );
}

export default function AdminMerchantsPage() {
  const { t } = useI18n();
  const { data: applications, isLoading, isError, error } = useAllApplications();
  const verifyMutation = useVerifyMerchant();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [decision, setDecision] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit(e: FormEvent, merchantId: string) {
    e.preventDefault();
    if (!decision) {
      toast.error('Please select a decision');
      return;
    }
    verifyMutation.mutate(
      { merchantId, data: { decision, notes: notes || undefined } },
      {
        onSuccess: () => {
          toast.success(`Merchant ${decision.toLowerCase()}`);
          setExpandedId(null);
          resetForm();
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

  function resetForm() {
    setDecision('');
    setNotes('');
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      resetForm();
    } else {
      setExpandedId(id);
      resetForm();
    }
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
      <h1 className="text-2xl font-semibold">{t('merchant.verification.title')}</h1>

      {!applications || applications.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('merchant.application.noApplications')}
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-medium">{app.businessName}</h2>
                    {app.displayName && (
                      <p className="text-sm text-muted-foreground">{app.displayName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.verificationStatus} />
                    {(app.verificationStatus === 'SUBMITTED' || app.verificationStatus === 'UNDER_REVIEW') && (
                      <button
                        onClick={() => toggleExpand(app.id)}
                        className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                      >
                        {t('merchant.verification.decision')}
                        <ChevronDown className={`size-3 transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === app.id && (
                  <form onSubmit={(e) => handleSubmit(e, app.id)} className="mt-4 space-y-3 border-t pt-4">
                    <div className="space-y-1.5">
                      <Label>{t('merchant.verification.decision')}</Label>
                      <select
                        className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                        value={decision}
                        onChange={(e) => setDecision(e.target.value)}
                        required
                      >
                        <option value="">{t('merchant.verification.selectDecision')}</option>
                        <option value="APPROVED">{t('merchant.verification.approve')}</option>
                        <option value="UNDER_REVIEW">{t('merchant.status.UNDER_REVIEW')}</option>
                        <option value="REJECTED">{t('merchant.verification.reject')}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>{t('merchant.verification.notes')}</Label>
                      <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>

                    <Button type="submit" loading={verifyMutation.isPending}>
                      {t('merchant.verification.submit')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
