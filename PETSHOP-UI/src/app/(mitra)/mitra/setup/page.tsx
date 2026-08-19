'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Store } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCreateBranch } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';
import type { CreateBranchRequest } from '@/features/merchant/types';

export default function MitraSetupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const createMutation = useCreateBranch();
  const [form, setForm] = useState<CreateBranchRequest>({
    name: '',
    phoneNumber: '',
    email: '',
    provinceName: '',
    cityName: '',
    districtName: '',
    postalCode: '',
    addressLine: '',
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('merchant.setup.success'));
        router.push('/mitra/home');
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

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Store className="mx-auto size-10 text-primary" />
          <CardTitle className="mt-2">{t('merchant.setup.title')}</CardTitle>
          <CardDescription>
            {t('merchant.setup.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('merchant.branch.name')} *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('merchant.setup.namePlaceholder')} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.phone')}</Label>
                <Input value={form.phoneNumber ?? ''} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.branch.email')}</Label>
                <Input type="email" value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>{t('merchant.branch.address')}</Label>
              <Input value={form.addressLine ?? ''} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} placeholder={t('merchant.setup.addressPlaceholder')} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>{t('merchant.setup.city')}</Label>
                <Input value={form.cityName ?? ''} onChange={(e) => setForm({ ...form, cityName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>{t('merchant.setup.postalCode')}</Label>
                <Input value={form.postalCode ?? ''} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
            </div>
            <Button type="submit" className="w-full" loading={createMutation.isPending}>
              {t('merchant.setup.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
