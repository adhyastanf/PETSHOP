'use client';

import Link from 'next/link';
import { LogOut, User, ShoppingBag, Heart, PawPrint, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useLogout } from '@/hooks/use-auth';
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
  const { isAuthenticated, user } = useAuthStore();
  const logoutMutation = useLogout();

  if (!isAuthenticated) {
    return (
      <div className='flex gap-2'>
        <Link href='/login'>
          <Button variant='outline' size='sm'>
            Masuk
          </Button>
        </Link>
        <Link href='/register'>
          <Button size='sm'>
            Daftar
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
              Profil Saya
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/pets'>
            <DropdownMenuItem>
              <PawPrint className='mr-2 size-4' />
              Hewan Saya
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/orders'>
            <DropdownMenuItem>
              <ShoppingBag className='mr-2 size-4' />
              Pesanan Saya
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/wishlist'>
            <DropdownMenuItem>
              <Heart className='mr-2 size-4' />
              Wishlist
            </DropdownMenuItem>
          </Link>
          <Link href='/customer/settings'>
            <DropdownMenuItem>
              <Settings className='mr-2 size-4' />
              Pengaturan
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className='mr-2 size-4' />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
