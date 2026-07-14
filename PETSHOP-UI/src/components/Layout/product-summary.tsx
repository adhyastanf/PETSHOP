'use client';

import { useCartStore } from '@/store/cart-store';
import { ProductDetailTypes } from '@/types/product-detail-types';
import { Plus } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import QuantityInput from '../Input/InputQuantity';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

const MOCK_PRODUCT_DETAIL = {
  id: 101,
  name: 'Foom Red Apple Salt Nic 30ml',
  price: 85000,
  sku: 'FOM-RED-APP-30',
  imageUrl: 'https://images.unsplash.com/photo-1511688868355-7216ee30bc32?w=150',
  mitra: {
    id: 1,
    name: 'Petshop Bandung',
    city: 'Bandung',
    isOfficialStore: true,
  },
};

type ProductSummaryProps = ComponentProps<typeof Card> & {
  data: ProductDetailTypes;
};

export default function ProductSummary({ data, ...props }: ProductSummaryProps) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const stock = data.stock;
  const price = qty * 200;
  const { addCart } = useCartStore((state) => state);

  async function handleAddCart() {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addCart({
        id: Date.now(), // Generate ID unik sementara untuk baris keranjang belanja
        quantity: qty,
        mitra: {
          id: MOCK_PRODUCT_DETAIL.mitra.id,
          name: MOCK_PRODUCT_DETAIL.mitra.name,
          city: MOCK_PRODUCT_DETAIL.mitra.city,
          isOfficialStore: MOCK_PRODUCT_DETAIL.mitra.isOfficialStore,
        },
        product: {
          id: MOCK_PRODUCT_DETAIL.id,
          name: MOCK_PRODUCT_DETAIL.name,
          price: MOCK_PRODUCT_DETAIL.price,
          sku: MOCK_PRODUCT_DETAIL.sku,
          imageUrl: MOCK_PRODUCT_DETAIL.imageUrl,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <div>Atur Jumlah Pembelian</div>
        <div>{data.name}</div>
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='space-y-4'>
          <QuantityInput value={qty} onValueChange={setQty} min={1} max={stock} />
          <span>Stok: {stock}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span>Subtotal</span>
          <span className='text-3xl font-bold'>Rp{price}</span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-col space-y-4'>
        <Button className='w-full py-5 transition-all' onClick={handleAddCart} disabled={loading} loading={loading}>
          <Plus />
          Keranjang
        </Button>
        <Button className='w-full py-5'>Beli Langsung</Button>
      </CardFooter>
    </Card>
  );
}
