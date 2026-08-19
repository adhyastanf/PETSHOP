'use client';

import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { useMyApplications } from '@/features/merchant/query';

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  const colors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-800',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SUSPENDED: 'bg-gray-100 text-gray-800',
    DRAFT: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-800'}`}>
      {t(`merchant.status.${status}`) || status}
    </span>
  );
}

export default function MerchantStatusPage() {
  const { t } = useI18n();
  const { data: applications, isLoading, isError, error } = useMyApplications();

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
        <h1 className="text-2xl font-semibold">{t('merchant.application.status')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('merchant.application.myApplications')}</p>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('merchant.application.noApplications')}
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">{app.businessName}</h2>
                    {app.displayName && (
                      <p className="text-sm text-muted-foreground">{app.displayName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={app.verificationStatus} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
