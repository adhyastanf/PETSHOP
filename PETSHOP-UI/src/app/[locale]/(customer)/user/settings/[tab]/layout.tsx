import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Link } from '@/lib/i18n/navigation';
import { HeartIcon, HomeIcon, PawPrintIcon, SettingsIcon, ShoppingBagIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const accountMenus = [
  {
    title: 'Akun Saya',
    href: '/user/settings/profile',
    Icon: SettingsIcon,
    key: 'profile',
  },
  {
    title: 'My Pets',
    href: '/user/settings/pets',
    Icon: PawPrintIcon,
    key: 'pets',
  },
  {
    title: 'Address',
    href: '/user/settings/address',
    Icon: HomeIcon,
    key: 'address',
  },
  {
    title: 'Pesanan Saya',
    href: '/user/settings/orders',
    Icon: ShoppingBagIcon,
    key: 'orders',
  },
  {
    title: 'Wishlist',
    href: '/user/settings/wishlist',
    Icon: HeartIcon,
    key: 'wishlist',
  },
];

export default async function AccountLayout({ children, params }: { children: ReactNode; params: Promise<{ tab: string }> }) {
  const { tab } = await params;

  return (
    <SidebarProvider className='flex w-full min-w-0' style={{ minHeight: 0 }}>
      <div className='flex w-full min-w-0 items-start gap-6'>
        <Sidebar collapsible='none' className='w-64 shrink-0 rounded-xl border bg-card'>
          <SidebarContent>
            <SidebarGroup className='px-4 py-6'>
              <SidebarGroupLabel className='mb-2 text-xl font-bold text-foreground'>Akun Saya</SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className='gap-2'>
                  {accountMenus.map(({ title, href, Icon, key }) => (
                    <SidebarMenuItem key={key}>
                      <SidebarMenuButton
                        className='font-semibold'
                        isActive={key === tab}
                        render={
                          <Link href={href}>
                            <Icon />
                            <span>{title}</span>
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

        <main className='min-w-0 flex-1 rounded-xl border bg-card p-4 md:p-6'>{children}</main>
      </div>
    </SidebarProvider>
  );
}
