'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { ActiveBadge } from '@/components/general/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCommissionRules, useSetCommissionRuleActive } from '@/features/config/query';
import { formatEffectiveDate } from '@/features/config/format';
import type { CommissionRule } from '@/features/config/types';
import { alertDialog } from '@/lib/alert-dialog';
import type { Locale } from '@/locales';
import { showApiError } from '@/utils/show-api-error';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import CommissionRuleForm from './Form/CommissionRuleForm';

export default function CommissionRulesContainers() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const { data: rules, isLoading, isError, error } = useCommissionRules();
  const toggleMutation = useSetCommissionRuleActive();
  const [showForm, setShowForm] = useState(false);

  function performToggle(rule: CommissionRule) {
    toggleMutation.mutate(
      { id: rule.id, active: !rule.isActive },
      {
        onSuccess: () => toast.success(t('config.commission.statusChanged')),
        onError: (err) => showApiError(err, t),
      },
    );
  }

  function handleDeactivate(rule: CommissionRule) {
    alertDialog.confirm({
      title: t('config.commission.deactivateTitle'),
      description: t('config.commission.deactivateDescription'),
      confirmText: t('config.common.deactivate'),
      cancelText: t('config.common.cancel'),
      onConfirm: () => performToggle(rule),
    });
  }

  if (isLoading) return <PageLoading label={t('config.common.loading')} />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>{t('config.commission.title')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>{t('config.commission.description')}</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className='size-4' />
          {t('config.commission.create')}
        </Button>
      </div>

      <div className='rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800'>{t('config.commission.historicalNote')}</div>

      {showForm && <CommissionRuleForm onClose={() => setShowForm(false)} />}

      {!rules || rules.length === 0 ? (
        <PageEmpty message={t('config.common.noData')} />
      ) : (
        <Card>
          <CardContent className='p-0'>
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
                  <TableHead className='text-right'>{t('config.commission.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => {
                  const isToggling = toggleMutation.isPending && toggleMutation.variables?.id === rule.id;
                  return (
                    <TableRow key={rule.id}>
                      <TableCell className='font-medium'>{rule.transactionType}</TableCell>
                      <TableCell>{rule.scope}</TableCell>
                      <TableCell>{rule.commissionType}</TableCell>
                      <TableCell>{rule.commissionType === 'PERCENTAGE' ? `${rule.commissionValue}%` : rule.commissionValue}</TableCell>
                      <TableCell>{rule.priority ?? 0}</TableCell>
                      <TableCell>{formatEffectiveDate(rule.validFrom, locale, t('config.commission.unlimited'))}</TableCell>
                      <TableCell>{formatEffectiveDate(rule.validUntil, locale, t('config.commission.unlimited'))}</TableCell>
                      <TableCell>
                        <ActiveBadge active={rule.isActive} activeLabel={t('config.common.active')} inactiveLabel={t('config.common.inactive')} />
                      </TableCell>
                      <TableCell className='text-right'>
                        {rule.isActive ? (
                          <Button variant='outline' size='sm' loading={isToggling} onClick={() => handleDeactivate(rule)}>
                            {t('config.common.deactivate')}
                          </Button>
                        ) : (
                          <Button variant='default' size='sm' loading={isToggling} onClick={() => performToggle(rule)}>
                            {t('config.common.activate')}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
