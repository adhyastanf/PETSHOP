'use client';

import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { usePaymentMethods, useSetPaymentMethodActive } from '@/features/config/query';
import { ApiError } from '@/lib/api-client';
import type { PaymentMethod } from '@/features/config/types';

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

export default function AdminPaymentMethodsPage() {
  const { t } = useI18n();
  const { data: methods, isLoading, isError, error } = usePaymentMethods();
  const toggleMutation = useSetPaymentMethodActive();

  function handleToggle(method: PaymentMethod) {
    toggleMutation.mutate(
      { id: method.id, isActive: !method.isActive },
      {
        onSuccess: () => toast.success(t('config.payment.statusChanged')),
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
      <div>
        <h1 className="text-2xl font-semibold">{t('config.payment.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('config.payment.description')}</p>
      </div>

      {!methods || methods.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('config.common.noData')}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('config.payment.provider')}</TableHead>
                  <TableHead>{t('config.payment.method')}</TableHead>
                  <TableHead>{t('config.payment.name')}</TableHead>
                  <TableHead>{t('config.payment.type')}</TableHead>
                  <TableHead>{t('config.payment.status')}</TableHead>
                  <TableHead className="text-right">{t('config.commission.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.providerCode}</TableCell>
                    <TableCell>{m.methodCode}</TableCell>
                    <TableCell>{m.name}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>
                      <StatusBadge active={m.isActive} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={m.isActive ? 'outline' : 'default'}
                        size="sm"
                        loading={toggleMutation.isPending && toggleMutation.variables?.id === m.id}
                        onClick={() => handleToggle(m)}
                      >
                        {m.isActive ? t('config.common.deactivate') : t('config.common.activate')}
                      </Button>
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
