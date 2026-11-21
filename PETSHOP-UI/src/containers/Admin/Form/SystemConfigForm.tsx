'use client';

import { FormSelectField, FormTextField } from '@/components/Input/FormField';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUpdateSystemConfig } from '@/features/config/query';
import type { SystemConfig } from '@/features/config/types';
import { alertDialog } from '@/lib/alert-dialog';
import { createSystemConfigSchema, type SystemConfigFormSchema } from '@/lib/schema/config-schema';
import { showApiError } from '@/utils/show-api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const BOOLEAN_ITEMS = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
];

/** One editable system business setting. Saving asks for confirmation first. */
export default function SystemConfigForm({ config }: { config: SystemConfig }) {
  const t = useTranslations();
  const updateMutation = useUpdateSystemConfig();
  const schema = useMemo(() => createSystemConfigSchema(config.valueType), [config.valueType]);
  const { control, handleSubmit } = useForm<SystemConfigFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { value: config.value ?? '' },
  });

  // Prefer a translated label for known keys; fall back to description or key.
  const labelKey = `config.systemConfig.keys.${config.key}`;
  const label = t(labelKey) !== labelKey ? t(labelKey) : (config.description ?? config.key);

  // Prefer a translated per-key description; fall back to the backend description.
  const descKey = `config.systemConfig.descriptions.${config.key}`;
  const description = t(descKey) !== descKey ? t(descKey) : (config.description ?? null);

  const range = config.min !== null && config.max !== null ? `${config.min} – ${config.max}` : null;

  function performSave(value: string) {
    updateMutation.mutate(
      { key: config.key, value },
      {
        onSuccess: () => toast.success(t('config.systemConfig.updateSuccess')),
        onError: (err) => showApiError(err, t),
      },
    );
  }

  function onSubmit(values: SystemConfigFormSchema) {
    alertDialog.confirm({
      title: t('config.systemConfig.saveTitle'),
      description: t('config.systemConfig.saveDescription', { label, value: values.value }),
      confirmText: t('config.common.save'),
      cancelText: t('config.common.cancel'),
      onConfirm: () => performSave(values.value),
    });
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-wrap items-end gap-4'>
          <div className='min-w-0 flex-1'>
            <p className='font-medium'>{label}</p>
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
            <p className='text-xs text-muted-foreground'>
              {config.key} · {config.valueType}
              {range ? ` · ${t('config.systemConfig.range')}: ${range}` : ''}
            </p>
          </div>
          <div className='w-40'>
            {config.valueType === 'BOOLEAN' ? (
              <FormSelectField control={control} name='value' label={label} items={BOOLEAN_ITEMS} hideLabel />
            ) : (
              <FormTextField control={control} name='value' label={label} type='number' step={config.valueType === 'DECIMAL' ? '0.01' : '1'} hideLabel />
            )}
          </div>
          <Button type='submit' loading={updateMutation.isPending}>
            {t('config.common.save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
