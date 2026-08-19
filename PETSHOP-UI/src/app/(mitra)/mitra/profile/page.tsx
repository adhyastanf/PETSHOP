'use client';

import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchantProfile, useUpdateMerchantProfile } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';
import type { UpdateMerchantProfileRequest } from '@/features/merchant/types';

export default function MitraProfilePage() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const { data: profile, isLoading, isError, error } = useMerchantProfile();
  const updateMutation = useUpdateMerchantProfile();
  const [form, setForm] = useState<UpdateMerchantProfileRequest>({
    displayName: '',
    description: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
  });

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName ?? '',
        description: profile.description ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        whatsappNumber: profile.whatsappNumber ?? '',
      });
    }
  }, [profile]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateMutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('merchant.profile.save'));
      },
      onError: (err) => {
        if (err instanceof ApiError) {
          toast.error(err.message);
        } else {
          toast.error(t('common.networkError'));
        }
      },
    });
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
      <div>
        <h1 className="text-2xl font-semibold">{t('merchant.profile.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile?.businessName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isOwner ? t('merchant.profile.edit') : t('merchant.profile.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('merchant.application.displayName')}</Label>
                <Input disabled={!isOwner} value={form.displayName ?? ''} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.email')}</Label>
                <Input disabled={!isOwner} type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.phone')}</Label>
                <Input disabled={!isOwner} value={form.phoneNumber ?? ''} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.application.whatsapp')}</Label>
                <Input disabled={!isOwner} value={form.whatsappNumber ?? ''} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea disabled={!isOwner} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            {isOwner && (
              <Button type="submit" loading={updateMutation.isPending}>{t('merchant.profile.save')}</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
