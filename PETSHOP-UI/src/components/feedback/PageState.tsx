'use client';

import { useTranslations } from 'next-intl';

/** Loading state for a page/container. */
export function PageLoading({ label }: { label?: string }) {
  const t = useTranslations();
  return <div className='py-10 text-sm text-muted-foreground'>{label ?? t('common.loading')}</div>;
}

/** Error state for a failed query. */
export function PageError({ error }: { error: unknown }) {
  const t = useTranslations();
  return <div className='rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive'>{error instanceof Error ? error.message : t('common.unknownError')}</div>;
}

/** Empty state for a list. */
export function PageEmpty({ message }: { message: string }) {
  return <div className='rounded-md border border-dashed p-6 text-sm text-muted-foreground'>{message}</div>;
}
