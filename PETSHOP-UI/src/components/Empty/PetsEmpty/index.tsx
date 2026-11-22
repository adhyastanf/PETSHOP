import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { PawPrintIcon, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmptyPets({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations();

  return (
    <Empty className='min-h-120 mb-0 '>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <PawPrintIcon aria-hidden='true' />
        </EmptyMedia>
        <EmptyTitle>{t('pet.noPets')}</EmptyTitle>
        <EmptyDescription>{t('pet.emptyDescription')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAdd} className='mt-2'>
          <Plus data-icon='inline-start' aria-hidden='true' />
          Daftarkan Hewan Peliharaan
        </Button>
      </EmptyContent>
    </Empty>
  );
}
