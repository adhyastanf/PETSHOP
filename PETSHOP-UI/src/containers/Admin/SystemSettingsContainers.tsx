'use client';

import { PageEmpty, PageError, PageLoading } from '@/components/feedback/PageState';
import { useSystemConfig } from '@/features/config/query';
import { useTranslations } from 'next-intl';
import SystemConfigForm from './Form/SystemConfigForm';

export default function SystemSettingsContainers() {
  const t = useTranslations();
  const { data: configs, isLoading, isError, error } = useSystemConfig();

  if (isLoading) return <PageLoading label={t('config.common.loading')} />;
  if (isError) return <PageError error={error} />;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold'>{t('config.systemConfig.title')}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{t('config.systemConfig.description')}</p>
      </div>

      {!configs || configs.length === 0 ? (
        <PageEmpty message={t('config.common.noData')} />
      ) : (
        <div className='space-y-3'>
          {configs.map((config) => (
            <SystemConfigForm key={config.key} config={config} />
          ))}
        </div>
      )}
    </div>
  );
}
