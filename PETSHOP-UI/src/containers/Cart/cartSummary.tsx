'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency } from '@/utils/format';

export default function CartSummary() {
  const data = useCartStore((state) => state.data);

  const totalProduct = data
    .filter((item) => item.isChecked)
    .reduce((a, b) => {
      return a + b.product.price;
    }, 0);

  const isButtonDisabled = !totalProduct;

  return (
    <Card className='self-start sticky top-20'>
      <CardHeader>
        <h2 className='text-2xl font-bold'>Order Summary</h2>
      </CardHeader>
      <CardContent className='flex justify-between'>
        <span>Total :</span>
        <span className='font-bold'>{formatCurrency(totalProduct)}</span>
      </CardContent>
      <CardFooter>
        <Button className='w-full py-5' disabled={isButtonDisabled}>
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
}
