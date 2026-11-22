import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import { Car, HeartIcon, HomeIcon, PawPrintIcon, SettingsIcon, ShoppingBagIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components/ui/card';

const accountMenus = [
  {
    label: 'myProfile',
    href: '/user/settings/profile',
    Icon: SettingsIcon,
    key: 'profile',
  },
  {
    label: 'myPets',
    href: '/user/settings/pets',
    Icon: PawPrintIcon,
    key: 'pets',
  },
  {
    label: 'address',
    href: '/user/settings/address',
    Icon: HomeIcon,
    key: 'address',
  },
  {
    label: 'myOrders',
    href: '/user/settings/orders',
    Icon: ShoppingBagIcon,
    key: 'orders',
  },
  {
    label: 'wishlist',
    href: '/user/settings/wishlist',
    Icon: HeartIcon,
    key: 'wishlist',
  },
];

export default async function AccountLayout({ children, params }: { children: ReactNode; params: Promise<{ tab: string }> }) {
  const { tab } = await params;
  const t = await getTranslations('customer');

  return (
    <SidebarProvider className='mx-auto flex w-full max-w-7xl min-w-0 items-start gap-5 px-4 py-5 sm:px-6 lg:gap-6 lg:px-8 lg:py-8' style={{ minHeight: 0 }}>
      <Sidebar collapsible='none' className='sticky top-24 hidden w-64 shrink-0 rounded-xl border bg-card lg:block'>
        <SidebarContent>
          <SidebarGroup className='px-3 py-5'>
            <SidebarGroupLabel className='mb-3 px-3 text-lg font-semibold text-foreground'>{t('account.title')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className='gap-1'>
                {accountMenus.map(({ label, href, Icon, key }) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      className='min-h-11 rounded-lg px-3 font-medium'
                      isActive={key === tab}
                      render={
                        <Link href={href} aria-current={key === tab ? 'page' : undefined}>
                          <Icon aria-hidden='true' />
                          <span>{t(`nav.${label}`)}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className='min-w-0 flex-1'>
        <nav aria-label={t('account.title')} className='mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden'>
          {accountMenus.map(({ label, href, Icon, key }) => (
            <Button key={key} variant={key === tab ? 'secondary' : 'ghost'} size='sm' className='shrink-0' render={<Link href={href} aria-current={key === tab ? 'page' : undefined} />} nativeButton={false}>
              <Icon data-icon='inline-start' aria-hidden='true' />
              {t(`nav.${label}`)}
            </Button>
          ))}
        </nav>
        <main className='min-w-0'>
          <Card>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </main>
      </div>
    </SidebarProvider>
  );
}
