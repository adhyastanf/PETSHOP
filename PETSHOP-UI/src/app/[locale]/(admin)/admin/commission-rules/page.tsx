'use client';

import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  useCommissionRules,
  useCreateCommissionRule,
  useSetCommissionRuleActive,
} from '@/features/config/query';
import { ApiError } from '@/lib/api-client';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { formatEffectiveDate } from '@/features/config/format';
import type {
  CommissionRule,
  CommissionTransactionType,
  CommissionType,
} from '@/features/config/types';

function StatusBadge({ active }: { active: boolean }) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {active ? t('config.common.active') : t('config.common.inactive')}
    </span>
  );
}

export default function AdminCommissionRulesPage() {
  const { t, locale } = useI18n();
  const { data: rules, isLoading, isError, error } = useCommissionRules();
  const createMutation = useCreateCommissionRule();
  const toggleMutation = useSetCommissionRuleActive();

  const [showForm, setShowForm] = useState(false);
  const [transactionType, setTransactionType] = useState<CommissionTransactionType>('PRODUCT');
  const [commissionType, setCommissionType] = useState<CommissionType>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState('0');
  const [merchantId, setMerchantId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  function resetForm() {
    setTransactionType('PRODUCT');
    setCommissionType('PERCENTAGE');
    setValue('');
    setPriority('0');
    setMerchantId('');
    setCategoryId('');
    setValidFrom('');
    setValidUntil('');
  }

  function toIso(dateInput: string): string | null {
    if (!dateInput) return null;
    return new Date(dateInput).toISOString();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      toast.error(t('common.networkError'));
      return;
    }
    // UX-only check; backend validation remains authoritative.
    if (validFrom && validUntil && new Date(validUntil) <= new Date(validFrom)) {
      toast.error(t('config.commission.invalidDateRange'));
      return;
    }
    createMutation.mutate(
      {
        transactionType,
        commissionType,
        commissionValue: numericValue,
        priority: priority ? Number(priority) : 0,
        merchantId: merchantId.trim() || null,
        categoryId: categoryId.trim() || null,
        validFrom: toIso(validFrom),
        validUntil: toIso(validUntil),
      },
      {
        onSuccess: () => {
          toast.success(t('config.commission.createSuccess'));
          setShowForm(false);
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

  function performToggle(rule: CommissionRule) {
    toggleMutation.mutate(
      { id: rule.id, active: !rule.isActive },
      {
        onSuccess: () => toast.success(t('config.commission.statusChanged')),
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
    return <div className="py-10 text-sm text-muted-foreground">{t('config.common.loading')}</div>;
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('config.commission.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('config.commission.description')}</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="size-4" />
          {t('config.commission.create')}
        </Button>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        {t('config.commission.historicalNote')}
      </div>

      {showForm && (
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-medium">{t('config.commission.createTitle')}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>{t('config.commission.transactionType')}</Label>
                  <select
                    className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value as CommissionTransactionType)}
                  >
                    <option value="PRODUCT">PRODUCT</option>
                    <option value="SERVICE">SERVICE</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>{t('config.commission.commissionType')}</Label>
                  <select
                    className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                    value={commissionType}
                    onChange={(e) => setCommissionType(e.target.value as CommissionType)}
                  >
                    <option value="PERCENTAGE">PERCENTAGE</option>
                    <option value="FIXED">FIXED</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="commissionValue">{t('config.commission.value')}</Label>
                  <Input
                    id="commissionValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="priority">{t('config.commission.priority')}</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="merchantId">{t('config.commission.merchantId')}</Label>
                  <Input id="merchantId" value={merchantId} onChange={(e) => setMerchantId(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="categoryId">{t('config.commission.categoryId')}</Label>
                  <Input id="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="validFrom">{t('config.commission.validFrom')}</Label>
                  <Input id="validFrom" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="validUntil">{t('config.commission.validUntil')}</Label>
                  <Input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t('config.commission.targetHint')}</p>
              <div className="flex gap-2">
                <Button type="submit" loading={createMutation.isPending}>
                  {t('config.common.create')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t('config.common.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!rules || rules.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('config.common.noData')}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('config.commission.transactionType')}</TableHead>
                  <TableHead>{t('config.commission.scope')}</TableHead>
                  <TableHead>{t('config.commission.commissionType')}</TableHead>
                  <TableHead>{t('config.commission.value')}</TableHead>
                  <TableHead>{t('config.commission.priority')}</TableHead>
                  <TableHead>{t('config.commission.validFrom')}</TableHead>
                  <TableHead>{t('config.commission.validUntil')}</TableHead>
                  <TableHead>{t('config.commission.status')}</TableHead>
                  <TableHead className="text-right">{t('config.commission.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.transactionType}</TableCell>
                    <TableCell>{rule.scope}</TableCell>
                    <TableCell>{rule.commissionType}</TableCell>
                    <TableCell>
                      {rule.commissionType === 'PERCENTAGE'
                        ? `${rule.commissionValue}%`
                        : rule.commissionValue}
                    </TableCell>
                    <TableCell>{rule.priority ?? 0}</TableCell>
                    <TableCell>{formatEffectiveDate(rule.validFrom, locale, t('config.commission.unlimited'))}</TableCell>
                    <TableCell>{formatEffectiveDate(rule.validUntil, locale, t('config.commission.unlimited'))}</TableCell>
                    <TableCell>
                      <StatusBadge active={rule.isActive} />
                    </TableCell>
                    <TableCell className="text-right">
                      {rule.isActive ? (
                        <ConfirmDialog
                          title={t('config.commission.deactivateTitle')}
                          description={t('config.commission.deactivateDescription')}
                          confirmLabel={t('config.common.deactivate')}
                          cancelLabel={t('config.common.cancel')}
                          loading={toggleMutation.isPending && toggleMutation.variables?.id === rule.id}
                          onConfirm={() => performToggle(rule)}
                        >
                          {(open) => (
                            <Button variant="outline" size="sm" onClick={open}>
                              {t('config.common.deactivate')}
                            </Button>
                          )}
                        </ConfirmDialog>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          loading={toggleMutation.isPending && toggleMutation.variables?.id === rule.id}
                          onClick={() => performToggle(rule)}
                        >
                          {t('config.common.activate')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
