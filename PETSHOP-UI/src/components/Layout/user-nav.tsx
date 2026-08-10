'use client';

import { useLogout, useMe } from '@/hooks/use-auth';
import { Heart, LogOut, Settings, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

export default function UserNav() {
  const { data: user, isLoading } = useMe();

  const { mutate: logout } = useLogout();

  function handleLogout() {
    logout();
  }

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
            Masuk
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
          <button className='inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-medium hover:bg-muted cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring'>
            <User className='size-4' />
            <span className='max-w-32 truncate'>{user?.fullName}</span>
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
          <DropdownMenuItem>
            <User className='mr-2 size-4' />
            Profil Saya
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShoppingBag className='mr-2 size-4' />
            Pesanan Saya
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Heart className='mr-2 size-4' />
            Wishlist
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className='mr-2 size-4' />
            Pengaturan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={false}>
          <LogOut className='mr-2 size-4' />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
