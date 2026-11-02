'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBranches, useCreateBranch } from '@/features/merchant/query';
import { ApiError } from '@/lib/api-client';
import type { CreateBranchRequest } from '@/features/merchant/types';

const emptyBranch: CreateBranchRequest = {
  name: '',
  phoneNumber: '',
  email: '',
  addressLine: '',
};

export default function MitraBranchesPage() {
  const { t } = useI18n();
  const { user } = useAuthStore();
  const { data: branches, isLoading, isError, error } = useBranches();
  const createMutation = useCreateBranch();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateBranchRequest>(emptyBranch);

  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        toast.success(t('merchant.branch.create'));
        setForm(emptyBranch);
        setShowForm(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('merchant.branch.title')}</h1>
        {isOwner && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="size-4" />
            {t('merchant.branch.create')}
          </Button>
        )}
      </div>

      {isOwner && showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t('merchant.branch.create')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{t('merchant.branch.name')} *</Label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
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
                <Input value={form.addressLine ?? ''} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" loading={createMutation.isPending}>{t('merchant.branch.create')}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!branches || branches.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('merchant.branch.noBranches')}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {branches.map((branch) => (
            <Link key={branch.id} href={`/mitra/branches/${branch.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-medium">{branch.name}</h2>
                      <p className="text-sm text-muted-foreground">{branch.code}</p>
                      {branch.addressLine && (
                        <p className="mt-1 text-xs text-muted-foreground">{branch.addressLine}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
