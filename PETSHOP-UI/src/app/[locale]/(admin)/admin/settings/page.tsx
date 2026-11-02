'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmDialog from '@/components/feedback/ConfirmDialog';
import { useSystemConfig, useUpdateSystemConfig } from '@/features/config/query';
import { ApiError } from '@/lib/api-client';
import type { SystemConfig } from '@/features/config/types';

function ConfigRow({ config }: { config: SystemConfig }) {
  const { t } = useI18n();
  const updateMutation = useUpdateSystemConfig();
  const [value, setValue] = useState(config.value ?? '');

  // Prefer a translated label for known keys; fall back to description or key.
  const labelKey = `config.systemConfig.keys.${config.key}`;
  const label = t(labelKey) !== labelKey ? t(labelKey) : config.description ?? config.key;

  // Prefer a translated per-key description; fall back to the backend description.
  const descKey = `config.systemConfig.descriptions.${config.key}`;
  const description = t(descKey) !== descKey ? t(descKey) : config.description ?? null;

  const range =
    config.min !== null && config.max !== null ? `${config.min} – ${config.max}` : null;

  function performSave() {
    updateMutation.mutate(
      { key: config.key, value },
      {
        onSuccess: () => toast.success(t('config.systemConfig.updateSuccess')),
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

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium">{label}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {config.key} · {config.valueType}
              {range ? ` · ${t('config.systemConfig.range')}: ${range}` : ''}
            </p>
          </div>
          <div className="w-40">
            {config.valueType === 'BOOLEAN' ? (
              <select
                className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <Input
                type="number"
                step={config.valueType === 'DECIMAL' ? '0.01' : '1'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label={label}
              />
            )}
          </div>
          <ConfirmDialog
            title={t('config.systemConfig.saveTitle')}
            description={t('config.systemConfig.saveDescription', { label, value })}
            confirmLabel={t('config.common.save')}
            cancelLabel={t('config.common.cancel')}
            loading={updateMutation.isPending}
            onConfirm={performSave}
          >
            {(open) => (
              <Button type="button" onClick={open} loading={updateMutation.isPending}>
                {t('config.common.save')}
              </Button>
            )}
          </ConfirmDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminSettingsPage() {
  const { t } = useI18n();
  const { data: configs, isLoading, isError, error } = useSystemConfig();

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
        <h1 className="text-2xl font-semibold">{t('config.systemConfig.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('config.systemConfig.description')}</p>
      </div>

      {!configs || configs.length === 0 ? (
        <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
          {t('config.common.noData')}
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((config) => (
            <ConfigRow key={config.key} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}
