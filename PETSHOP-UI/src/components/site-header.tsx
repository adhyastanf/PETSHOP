import { getTranslations } from 'next-intl/server';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export async function SiteHeader() {
  const t = await getTranslations('common');

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mx-2 h-4 data-vertical:self-auto' />
        <h1 className='text-base font-medium'>{t('dashboard')}</h1>
      </div>
    </header>
  );
}
