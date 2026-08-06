import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import IconButtonCartBell from '../general/cart-bell';
import IconButtonNotificationBell from '../general/notification-bell';
import InputSearch from '../Input/InputSearch';
import { Separator } from '../ui/separator';
import LanguageSwitcher from './language-switcher';
import UserNav from './user-nav';

export default function MenuAppComponent() {
  return (
    <header className='h-16 border-b border-border sticky top-0 z-50 bg-card'>
      <div className='h-full px-4 lg:px-8 flex gap-4 items-center justify-between max-w-7xl mx-auto'>
        <Link href='/customer/home' className='flex items-center gap-2 shrink-0'>
          <PawPrint className='size-7 text-primary' />
          <span className='text-lg font-bold text-foreground hidden sm:inline'>Oyen</span>
        </Link>
        <div className='flex-1 max-w-xl'>
          <InputSearch />
        </div>
        <div className='flex gap-3 items-center'>
          <IconButtonCartBell />
          <IconButtonNotificationBell />
          <LanguageSwitcher />
          <Separator orientation='vertical' className='h-6' />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
