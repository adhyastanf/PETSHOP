'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useApplyMerchant, useMyApplications } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';

export default function MerchantApplyPage() {
  const { t } = useI18n();
  const router = useRouter();
  const applyMutation = useApplyMerchant();
  const { data: applications, isLoading } = useMyApplications();
  const [form, setForm] = useState({
    businessName: '',
    displayName: '',
    description: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    nib: '',
    npwp: '',
  });

  // If user already has an application, show status instead of form
  const hasApplication = applications && applications.length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    applyMutation.mutate(
      { ...form, businessName: form.businessName },
      {
        onSuccess: () => {
          toast.success(t('merchant.application.submitted'));
          router.push('/customer/merchant-status');
        },
        onError: (error) => {
          if (error instanceof ApiError) {
            toast.error(error.message);
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

  if (hasApplication) {
    const app = applications[0];
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">{t('merchant.application.title')}</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Store className="size-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-medium">
              {t('merchant.application.submitted')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {app.businessName} — {t(`merchant.status.${app.verificationStatus}`)}
            </p>
            <Link href="/customer/merchant-status" className="mt-4">
              <Button variant="outline">{t('merchant.application.status')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('merchant.application.title')}</h1>
      <p className="text-sm text-muted-foreground">{t('merchant.application.description')}</p>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('merchant.application.businessName')} *</Label>
                <Input required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.displayName')}</Label>
                <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.email')}</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.phone')}</Label>
                <Input value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.whatsapp')}</Label>
                <Input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.nib')}</Label>
                <Input value={form.nib} onChange={(e) => setForm({ ...form, nib: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.npwp')}</Label>
                <Input value={form.npwp} onChange={(e) => setForm({ ...form, npwp: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button type="submit" loading={applyMutation.isPending}>{t('merchant.application.submit')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
