'use client';

import { Bell } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';

export default function IconButtonNotificationBell() {
  const { data } = useCartStore((state) => state);

  const total = data.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <Button variant='outline' size='icon' className='relative'>
      <Bell />
      {total > 0 && <Badge className='absolute -top-2.5 -right-2.5 min-w-5 px-1 tabular-nums'>{total}</Badge>}
    </Button>
  );
}
