import { getTranslations } from 'next-intl/server';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';

export default async function MitraHomePage() {
  const t = await getTranslations('common');
  return (
    <main className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <h1 className='px-4 text-2xl font-semibold lg:px-6'>{t('dashboard')}</h1>
          <SectionCards />
          <div className='px-4 lg:px-6'><ChartAreaInteractive /></div>
          <DataTable data={[]} />
        </div>
      </div>
    </main>
  );
}
