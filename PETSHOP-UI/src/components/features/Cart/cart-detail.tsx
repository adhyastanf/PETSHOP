'use client';

import { useMemo } from 'react';
import { useCartStore } from '@/store/cart-store';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import QuantityInput from '@/components/Input/InputQuantity';
import { CartItemTypes } from '@/types/cart-types';

export default function CartMain() {
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
    return <div className='text-center py-10 text-gray-500'>Keranjang kosong</div>;
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
  const quantity = item.quantity ?? 1;
  const checked = item.isChecked;

  return (
    <Card>
      <CardContent className='flex gap-4'>
        <Checkbox checked={checked} onCheckedChange={(value) => setChecked(item.id, value === true)} />

        <div className='size-20 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center overflow-hidden border'>
          {item.product.imageUrl ? <img src={item.product.imageUrl} alt={item.product.name} className='object-cover size-full' /> : <span className='text-xs text-gray-400'>No Image</span>}
        </div>

        <div className='flex-1 min-w-0 self-start'>
          <h4 className='font-medium text-gray-900 line-clamp-2 leading-snug'>{item.product.name}</h4>
          <span className='text-xs text-gray-400 mt-1 block'>SKU: {item.product.sku}</span>
        </div>

        <div className='w-44 shrink-0 flex flex-col items-end gap-3'>
          <div className='text-lg font-bold text-primary'>Rp {item.product.price.toLocaleString('id-ID')}</div>
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
