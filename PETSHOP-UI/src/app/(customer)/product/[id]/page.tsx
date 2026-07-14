import ProductSummary from '@/components/Layout/product-summary';
import { ProductDetailTypes } from '@/types/product-detail-types';

export default async function ProductDetail({ params }: ProductDetailProps) {
  const param = await params;

  const data = MOCK_DATA;

  return (
    <main className='grid grid-cols-[1.5fr_3fr_1.5fr] gap-4 py-10'>
      <div>
        <CardImageDetail />
      </div>
      <div className='h-250'>
        <h2 className='font-bold'>{data.description}</h2>
        <h2 className='font-bold text-3xl'>{data.originalPrice}</h2>
      </div>
      <ProductSummary data={data} className='self-start sticky top-20' />
    </main>
  );
}

function CardImageDetail() {
  return <div className='w-full aspect-square bg-gray-200 rounded-xl'></div>;
}

type ProductDetailProps = {
  params: Promise<{ id: string }>;
};

const MOCK_DATA: ProductDetailTypes = {
  id: 'PRD001',
  slug: 'nike-air-force-1-07',
  name: "Nike Air Force 1 '07",
  description: "The Nike Air Force 1 '07 combines classic court style with premium materials for everyday comfort and timeless design.",

  brand: 'Nike',
  category: 'Shoes',

  price: 1799000,
  originalPrice: 2199000,
  discount: 18,

  rating: 4.8,
  totalReviews: 248,
  sold: 1423,

  stock: 18,
  sku: 'AF1-07-WHITE-001',

  images: ['/images/products/air-force-1-1.jpg', '/images/products/air-force-1-2.jpg', '/images/products/air-force-1-3.jpg', '/images/products/air-force-1-4.jpg'],

  variants: {
    color: [
      {
        id: 'white',
        name: 'White',
      },
      {
        id: 'black',
        name: 'Black',
      },
    ],

    size: [39, 40, 41, 42, 43, 44],
  },

  specifications: [
    {
      label: 'Upper Material',
      value: 'Leather',
    },
    {
      label: 'Outsole',
      value: 'Rubber',
    },
    {
      label: 'Gender',
      value: 'Unisex',
    },
    {
      label: 'Country',
      value: 'Vietnam',
    },
  ],

  features: ['Premium leather upper', 'Foam midsole cushioning', 'Durable rubber outsole', 'Classic Air Force silhouette'],

  seller: {
    id: 'SELL001',
    name: 'Nike Official Store',
    rating: 4.9,
    followers: 245000,
  },
};
