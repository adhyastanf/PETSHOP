'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import QuantityInput from '@/components/Input/InputQuantity';
import { CartItemTypes } from '@/types/cart-types';
import { formatCurrency } from '@/utils/format';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function CartMain() {
  const t = useTranslations('customer.cart');
  const items = useCartStore((state) => state.data);
  const checkAllCart = useCartStore((state) => state.checkAllCart);
  const isAllChecked = items.every((item) => item.isChecked);

  const totalCart = items.length;

  const groupedCart = useMemo(() => {
    return items.reduce<GroupCartTypes[]>((acc, item) => {
      const existingGroup = acc.find((val) => val.mitraId === item.mitra.id);

      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({
          mitraId: item.mitra.id,
          mitraName: item.mitra.name,
          items: [item],
        });
      }
      return acc;
    }, []);
  }, [items]);

  if (!groupedCart.length) {
    return (
      <Empty className='gap-5 rounded-xl border bg-card px-6 py-10'>
        <EmptyHeader>
          <EmptyMedia variant='icon'><ShoppingCart aria-hidden='true' /></EmptyMedia>
          <EmptyTitle className='text-h3'>{t('emptyTitle')}</EmptyTitle>
          <EmptyDescription>{t('emptyDescription')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button render={<Link href='/' />} nativeButton={false} size='lg'>
            <ShoppingBag data-icon='inline-start' aria-hidden='true' />
            {t('emptyAction')}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent className='flex gap-4 items-center'>
          <Checkbox checked={isAllChecked} onCheckedChange={(checked) => checkAllCart(checked === true)} />
          <h3 className='font-bold'>{`Pilih Semua ( ${totalCart} )`}</h3>
        </CardContent>
      </Card>
      {groupedCart.map((group) => (
        <CartMitra key={group.mitraId} data={group} />
      ))}
    </div>
  );
}

function CartMitra({ data }: { data: { mitraId: number; mitraName: string; items: CartItemTypes[] } }) {
  const checkAllGroup = useCartStore((state) => state.checkAllGroup);
  const isGroupChecked = data.items.every((item) => item.isChecked);

  return (
    <Card className='overflow-hidden'>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-3'>
          <Checkbox checked={isGroupChecked} onCheckedChange={(checked) => checkAllGroup(data.mitraId, checked === true)} />
          <h3 className='font-bold text-lg text-gray-800'>{data.mitraName}</h3>
        </div>
        <CartList items={data.items} />
      </CardContent>
    </Card>
  );
}

function CartList({ items }: { items: CartItemTypes[] }) {
  return (
    <div className='space-y-4 pt-2'>
      {items.map((item) => (
        <CardCart key={item.id} item={item} />
      ))}
    </div>
  );
}

function CardCart({ item }: { item: CartItemTypes }) {
  const setChecked = useCartStore((state) => state.setChecked);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const quantity = item.quantity ?? 0;
  const checked = item.isChecked;

  return (
    <Card>
      <CardContent className='flex gap-4'>
        <Checkbox checked={checked} onCheckedChange={(value) => setChecked(item.id, value === true)} />

        <div className='size-20 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden border'>
          {item.product.imageUrl ? <Image src={item.product.imageUrl} alt={item.product.name} className='object-cover size-full' width={100} height={100} /> : <span className='text-xs text-gray-400'>No Image</span>}
        </div>

        <div className='flex-1 min-w-0 self-start'>
          <h4 className='font-medium text-gray-900 line-clamp-2 leading-snug'>{item.product.name}</h4>
          <span className='text-xs text-gray-400 mt-1 block'>SKU: {item.product.sku}</span>
        </div>

        <div className='w-44 shrink-0 flex flex-col items-end gap-3'>
          <div className='text-lg font-bold text-primary'>{formatCurrency(item.product.price)}</div>
          <QuantityInput value={quantity} onValueChange={(qty) => setQuantity(item.id, qty)} />
        </div>
      </CardContent>
    </Card>
  );
}

type GroupCartTypes = {
  mitraId: number;
  mitraName: string;
  items: CartItemTypes[];
};
