import CarouselComponent from '@/components/Layout/menu-carousel';
import CardProduct from '@/components/Layout/item-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Bone, BriefcaseMedical, Brush, Package, PawPrint, ShoppingBag, Store, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { MOCK_PRODUCTS } from '@/mock/products';

const STATS = ['partners', 'customers', 'rating', 'onTimeOrders'] as const;
const TABS = ['all', 'food', 'grooming', 'vaccines', 'accessories'] as const;
const QUICK_CATEGORIES: { key: string; icon: LucideIcon }[] = [
  { key: 'products', icon: Package },
  { key: 'food', icon: Bone },
  { key: 'grooming', icon: Brush },
  { key: 'health', icon: BriefcaseMedical },
  { key: 'petshops', icon: Store },
  { key: 'services', icon: PawPrint },
];

export default async function CustomerHome() {
  const t = await getTranslations('customer');

  return (
    <main className='flex flex-col gap-8 py-6 sm:gap-10 sm:py-10'>
      <CarouselComponent />

      <section aria-label={t('homeLanding.stats.title')} className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
        {STATS.map((stat) => (
          <Card key={stat}>
            <CardContent className='flex min-h-24 flex-col justify-center gap-1 p-4 text-center'>
              <p className='text-h2 font-bold tabular-nums'>1200+</p>
              <p className='text-small text-muted-foreground'>{t(`homeLanding.stats.${stat}`)}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className='flex flex-col gap-5'>
        <div>
          <h2 className='text-h2 tracking-tight'>{t('homeLanding.intro.title')}</h2>
          <p className='mt-1 max-w-3xl text-muted-foreground'>{t('homeLanding.intro.description')}</p>
        </div>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
          {QUICK_CATEGORIES.map(({ key, icon: Icon }) => (
            <Card key={key} className='transition-colors hover:bg-muted/40'>
              <CardContent className='flex items-center gap-4 px-4 py-1'>
                <span className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary' aria-hidden='true'>
                  <Icon className='size-5' />
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='font-semibold'>{t(`homeLanding.quickCategories.${key}.title`)}</p>
                  <p className='text-small text-muted-foreground'>{t(`homeLanding.quickCategories.${key}.description`)}</p>
                </div>
                <ArrowRight className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <MarketplaceSection title={t('homeLanding.sections.nearbyPetshops')} message={t('home.sectionUnavailable')} icon={Store} viewAll={t('homeLanding.viewAll')}>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {MOCK_PRODUCTS.map((product) => (
            <CardProduct key={product.id} product={product} featuredLabel={t('homeLanding.productCard.sample')} />
          ))}
        </div>
      </MarketplaceSection>
      <MarketplaceSection title={t('homeLanding.sections.popularProducts')} message={t('home.sectionUnavailable')} icon={ShoppingBag} viewAll={t('homeLanding.viewAll')}>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {MOCK_PRODUCTS.map((product) => (
            <CardProduct key={product.id} product={product} featuredLabel={t('homeLanding.productCard.sample')} />
          ))}
        </div>
      </MarketplaceSection>

      <Card className='overflow-hidden border-0 bg-primary text-primary-foreground'>
        <CardContent className='flex flex-col justify-between gap-5 px-6 py-8 sm:flex-row sm:items-center sm:px-8 sm:py-10'>
          <div className='flex max-w-2xl flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <Store className='size-5' aria-hidden='true' />
              <h2 className='text-h2'>{t('homeLanding.merchantCta.title')}</h2>
            </div>
            <p className='text-primary-foreground/85'>{t('homeLanding.merchantCta.description')}</p>
          </div>
          <Button type='button' variant='secondary' className='w-fit rounded-full px-5' disabled>
            {t('homeLanding.merchantCta.action')}
          </Button>
        </CardContent>
      </Card>

      <section className='flex flex-col gap-4'>
        <div>
          <h2 className='text-h2 tracking-tight'>{t('homeLanding.categories.title')}</h2>
          <p className='mt-1 text-muted-foreground'>{t('homeLanding.categories.description')}</p>
        </div>
        <Tabs defaultValue='all'>
          <TabsList variant='line' className='max-w-full justify-start gap-4 overflow-x-auto sm:gap-6'>
            {TABS.map((category) => (
              <TabsTrigger key={category} value={category} className='shrink-0 font-semibold'>
                {t(`homeLanding.tabs.${category}`)}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((category) => (
            <TabsContent key={category} value={category}>
              <Empty className='mt-4 min-h-40'>
                <EmptyHeader>
                  <EmptyMedia variant='icon'><ShoppingBag aria-hidden='true' /></EmptyMedia>
                  <EmptyDescription>{t('home.catalogUnavailable')}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  );
}

function MarketplaceSection({ title, message, icon: Icon, viewAll, children }: { title: string; message: string; icon: LucideIcon; viewAll: string; children?: ReactNode }) {
  return (
    <section className='flex min-w-0 flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-h2 tracking-tight'>{title}</h2>
        <Button variant='ghost' size='sm' className='shrink-0' disabled>
          {viewAll}
          <ArrowRight data-icon='inline-end' />
        </Button>
      </div>
      {children ?? (
        <Empty className='min-h-40'>
          <EmptyHeader>
            <EmptyMedia variant='icon'><Icon aria-hidden='true' /></EmptyMedia>
            <EmptyDescription>{message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
