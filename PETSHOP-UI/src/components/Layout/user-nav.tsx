'use client';

import Link from 'next/link';
import { LogOut, User, ShoppingBag, Heart, PawPrint, Settings, Store } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { useI18n } from '@/lib/i18n';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function UserNav() {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  if (!isAuthenticated) {
    return (
      <div className='flex gap-2'>
        <Link href='/login'>
          <Button variant='outline' size='sm'>
            {t('common.signIn')}
          </Button>
        </Link>
        <Link href='/register'>
          <Button size='sm'>
            {t('common.signUp')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium hover:bg-muted cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring'>
            <User className='size-4' />
            <span className='max-w-32 truncate'>
              {user?.fullName ?? 'Akun'}
            </span>
          </button>
        }
      />
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div>
              <p className='text-sm font-medium truncate'>{user?.fullName}</p>
              <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/customer/profile'>
            <DropdownMenuItem>
              <User className='mr-2 size-4' />
              {t('customer.nav.myProfile')}
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/pets'>
            <DropdownMenuItem>
              <PawPrint className='mr-2 size-4' />
              {t('customer.nav.myPets')}
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/orders'>
            <DropdownMenuItem>
              <ShoppingBag className='mr-2 size-4' />
              {t('customer.nav.myOrders')}
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/wishlist'>
            <DropdownMenuItem>
              <Heart className='mr-2 size-4' />
              {t('customer.nav.wishlist')}
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/settings'>
            <DropdownMenuItem>
              <Settings className='mr-2 size-4' />
              {t('customer.nav.settings')}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/customer/merchant-apply'>
            <DropdownMenuItem>
              <Store className='mr-2 size-4' />
              {t('merchant.application.title')}
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/merchant-status'>
            <DropdownMenuItem>
              <Store className='mr-2 size-4' />
              {t('merchant.application.status')}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className='mr-2 size-4' />
          {t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
