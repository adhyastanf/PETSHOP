'use client';

import { useLogout, useMe } from '@/hooks/use-auth';
import { Heart, LogOut, PawPrint, Settings, ShoppingBag, User, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import { useTranslations } from 'next-intl';

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: '/user/settings/profile',
    label: 'customer.nav.myProfile',
    icon: User,
  },
  {
    href: '/user/settings/pets',
    label: 'customer.nav.myPets',
    icon: PawPrint,
  },
  {
    href: '/user/settings/orders',
    label: 'customer.nav.myOrders',
    icon: ShoppingBag,
  },
  {
    href: '/customer/wishlist',
    label: 'customer.nav.wishlist',
    icon: Heart,
  },
  {
    href: '/customer/settings',
    label: 'customer.nav.settings',
    icon: Settings,
  },
];

export default function UserNav() {
  const t = useTranslations();
  const { data: user, isLoading } = useMe();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className='flex items-center gap-2'>
        <Skeleton className='h-9 w-28 rounded-lg' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex gap-2'>
        <Link href='/login'>
          <Button variant='outline' size='sm'>
            {t('common.signIn')}
          </Button>
        </Link>

        <Link href='/register'>
          <Button size='sm'>Daftar</Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className='inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'>
            <User className='size-4' />
            <span className='max-w-32 truncate'>{user.fullName}</span>
          </button>
        }
      />

      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div>
              <p className='truncate text-sm font-medium'>{user.fullName}</p>
              <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <DropdownMenuItem
              key={href}
              render={
                <Link href={href}>
                  <Icon className='mr-2 size-4' />
                  {t(label)}
                </Link>
              }
            />
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className='mr-2 size-4' />
          {t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
