import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { MapPin, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmptyAddress({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations();

  return (
    <Empty className='min-h-120 mb-0'>
      <EmptyHeader>
        <EmptyMedia variant='icon'><MapPin aria-hidden='true' /></EmptyMedia>
        <EmptyTitle>{t('customer.address.emptyTitle')}</EmptyTitle>
        <EmptyDescription>{t('customer.address.emptyDescription')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAdd} className='mt-2'>
          <Plus data-icon='inline-start' aria-hidden='true' />{t('customer.address.emptyAction')}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
