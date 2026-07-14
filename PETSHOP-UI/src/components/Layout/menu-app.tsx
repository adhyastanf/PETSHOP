import { Cat } from 'lucide-react';
import Link from 'next/link';
import IconButtonCartBell from '../general/cart-bell';
import IconButtonNotificationBell from '../general/notification-bell';
import InputSearch from '../Input/InputSearch';
import { Separator } from '../ui/separator';
import UserNav from './user-nav';

export default function MenuAppComponent() {
  return (
    <header className='py-4 border-b sticky top-0 z-50 bg-white'>
      <div className='px-20 flex gap-4 items-center justify-between'>
        <Link href={'/'}>
          <Cat size={40} />
        </Link>
        <InputSearch />
        <div className='flex gap-4 items-center'>
          <div className='flex gap-4'>
            <IconButtonCartBell />
            <IconButtonNotificationBell />
          </div>
          <Separator orientation='vertical' />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
