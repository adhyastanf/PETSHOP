'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useTranslations } from 'next-intl';
import { TriangleAlert } from 'lucide-react';

type ApiErrorStateProps = { onRetry: () => void; isRetrying?: boolean };

export default function ApiErrorState({ onRetry, isRetrying = false }: ApiErrorStateProps) {
  const t = useTranslations('common');

  return (
    <Card role='alert'>
      <CardContent className='flex flex-col items-center gap-3 py-8 text-center'>
        <TriangleAlert className='size-8 text-destructive' aria-hidden='true' />
        <p className='font-medium'>{t('loadError')}</p>
        <Button type='button' variant='outline' onClick={onRetry} disabled={isRetrying}>
          {isRetrying && <Spinner data-icon='inline-start' aria-hidden='true' />}
          {t('retry')}
        </Button>
      </CardContent>
    </Card>
  );
}
