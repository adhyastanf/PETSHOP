import { getTranslations } from 'next-intl/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader } from '@/components/ui/empty';

const METRICS = ['revenue', 'orders', 'customers', 'bookings'] as const;

export async function SectionCards() {
  const t = await getTranslations('common');

  return (
    <section aria-label={t('dashboardMetrics')} className='grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4'>
      {METRICS.map((metric) => (
        <Card key={metric} className='bg-linear-to-t from-primary/5 to-card shadow-xs'>
          <CardHeader className='gap-2'>
            <CardDescription>{t(`dashboardMetricLabels.${metric}`)}</CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums'>—</CardTitle>
          </CardHeader>
          <CardContent>
            <Empty className='items-start gap-0 rounded-none border-0 p-0 text-left'>
              <EmptyHeader className='items-start text-left'>
                <EmptyDescription>{t('dashboardMetricUnavailable')}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
