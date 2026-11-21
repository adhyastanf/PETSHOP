'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { ActiveBadge } from '@/components/general/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePaymentMethods, useSetPaymentMethodActive } from '@/features/config/query';
import type { PaymentMethod } from '@/features/config/types';
import { alertDialog } from '@/lib/alert-dialog';
import { showApiError } from '@/utils/show-api-error';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function PaymentMethodsContainers() {
  const t = useTranslations();
  const { data: methods, isLoading, isError, error } = usePaymentMethods();
  const toggleMutation = useSetPaymentMethodActive();

  // Presentation-only mapping of backend enum types to human-readable labels.
  // Falls back to the raw backend value when no translation exists. The backend
  // value / API contract is never changed.
  function typeLabel(type: string): string {
    const key = `config.payment.types.${type}`;
    const label = t(key);
    return label === key ? type : label;
  }

  function performToggle(method: PaymentMethod) {
    toggleMutation.mutate(
      { id: method.id, isActive: !method.isActive },
      {
        onSuccess: () => toast.success(t('config.payment.statusChanged')),
        onError: (err) => showApiError(err, t),
      },
    );
  }

  function handleDeactivate(method: PaymentMethod) {
    alertDialog.confirm({
      title: t('config.payment.deactivateTitle'),
      description: t('config.payment.deactivateDescription', { name: method.name }),
      confirmText: t('config.common.deactivate'),
      cancelText: t('config.common.cancel'),
      onConfirm: () => performToggle(method),
    });
  }

  if (isLoading) return <PageLoading label={t('config.common.loading')} />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('config.payment.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('config.payment.description')}</p>
      </div>

      {!methods || methods.length === 0 ? (
        <PageEmpty message={t('config.common.noData')} />
      ) : (
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('config.payment.provider')}</TableHead>
                  <TableHead>{t('config.payment.method')}</TableHead>
                  <TableHead>{t('config.payment.name')}</TableHead>
                  <TableHead>{t('config.payment.type')}</TableHead>
                  <TableHead>{t('config.payment.status')}</TableHead>
                  <TableHead className='text-right'>{t('config.commission.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.map((m) => {
                  const isToggling = toggleMutation.isPending && toggleMutation.variables?.id === m.id;
                  return (
                    <TableRow key={m.id}>
                      <TableCell className='font-medium'>{m.providerCode}</TableCell>
                      <TableCell>{m.methodCode}</TableCell>
                      <TableCell>{m.name}</TableCell>
                      <TableCell>{typeLabel(m.type)}</TableCell>
                      <TableCell>
                        <ActiveBadge active={m.isActive} activeLabel={t('config.common.active')} inactiveLabel={t('config.common.inactive')} />
                      </TableCell>
                      <TableCell className='text-right'>
                        {m.isActive ? (
                          <Button variant='outline' size='sm' loading={isToggling} onClick={() => handleDeactivate(m)}>
                            {t('config.common.deactivate')}
                          </Button>
                        ) : (
                          <Button variant='default' size='sm' loading={isToggling} onClick={() => performToggle(m)}>
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
