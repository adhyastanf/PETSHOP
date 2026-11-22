import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { getTranslations } from 'next-intl/server';
import { PackageSearch } from 'lucide-react';

export default async function ProductDetailPage() {
  const t = await getTranslations('customer.home');

  return (
    <main className='mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <Empty className='min-h-80'>
        <EmptyHeader>
          <EmptyMedia variant='icon'><PackageSearch aria-hidden='true' /></EmptyMedia>
          <EmptyTitle>{t('catalogUnavailableTitle')}</EmptyTitle>
          <EmptyDescription>{t('catalogUnavailable')}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
