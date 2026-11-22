'use client';

import QuantityInput from '@/components/Input/InputQuantity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductDetailTypes } from '@/types/product-detail-types';
import { formatCurrency } from '@/utils/format';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';

type ProductSummaryProps = ComponentProps<typeof Card> & {
  data: ProductDetailTypes;
  onAddToCart?: (product: ProductDetailTypes, quantity: number) => void;
  onBuyNow?: (product: ProductDetailTypes, quantity: number) => void;
  isAddingToCart?: boolean;
};

export default function ProductSummary({ data, onAddToCart, onBuyNow, isAddingToCart = false, ...props }: ProductSummaryProps) {
  const t = useTranslations('customer.product');
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = data.stock <= 0;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className='text-base'>{t('quantity')}</CardTitle>
        <p className='line-clamp-2 text-sm text-muted-foreground'>{data.name}</p>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <QuantityInput value={quantity} onValueChange={setQuantity} min={1} max={data.stock} disabled={isOutOfStock || isAddingToCart} aria-label={t('quantity')} />
        <p className='text-sm text-muted-foreground'>{t('stock', { count: data.stock })}</p>
        <div className='flex items-center justify-between gap-4'>
          <span className='text-sm text-muted-foreground'>{t('unitPrice')}</span>
          <span className='text-lg font-semibold'>{formatCurrency(data.price)}</span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-3'>
        <Button type='button' className='w-full' onClick={() => onAddToCart?.(data, quantity)} disabled={!onAddToCart || isOutOfStock || isAddingToCart}>
          {t('addToCart')}
        </Button>
        <Button type='button' variant='outline' className='w-full' onClick={() => onBuyNow?.(data, quantity)} disabled={!onBuyNow || isOutOfStock}>
          {t('buyNow')}
        </Button>
      </CardFooter>
    </Card>
  );
}
