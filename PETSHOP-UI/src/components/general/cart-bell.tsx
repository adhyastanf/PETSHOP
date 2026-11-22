'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function IconButtonCartBell() {
  const t = useTranslations('common');

  return (
    <Button render={<Link href='/cart' aria-label={t('cart')} />} nativeButton={false} variant='outline' size='icon' className='relative'>
      <ShoppingCart aria-hidden='true' />
    </Button>
  );
}
