import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from '@/components/ui/empty';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils';
import { ProductDetailTypes } from '@/types/product-detail-types';
import { formatCurrency } from '@/utils/format';
import { Package, PackageSearch } from 'lucide-react';
import Image from 'next/image';

type ProductCardProps = {
  product: ProductDetailTypes | null;
  unavailableMessage?: string;
  featuredLabel?: string;
  className?: string;
};

export default function CardProduct({ product, unavailableMessage, featuredLabel, className }: ProductCardProps) {
  if (!product) {
    return (
      <Empty className={cn('min-w-0', className)}>
        <EmptyHeader>
          <EmptyMedia variant='icon'><PackageSearch aria-hidden='true' /></EmptyMedia>
          <EmptyDescription>{unavailableMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const image = product.images[0];

  return (
    <Link href={`/product/${product.id}`} className='group w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
      <Card variant='interactive' className={cn('min-w-0 p-0', className)}>
        <div className='relative aspect-square w-full bg-muted'>
          {image ? (
            <Image src={image} alt={product.name} fill sizes='(max-width: 768px) 100vw, 240px' className='object-cover' />
          ) : (
            <div className='flex size-full items-center justify-center text-muted-foreground' aria-hidden='true'>
              <Package className='size-10' />
            </div>
          )}
        </div>
        <CardHeader className='gap-2'>
          {featuredLabel && (
            <Badge variant='secondary' className='w-fit'>
              {featuredLabel}
            </Badge>
          )}
          <CardTitle className='line-clamp-2'>{product.name}</CardTitle>
          <CardDescription className='line-clamp-2'>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className='mb-4'>
          <p className='font-semibold text-foreground'>{formatCurrency(product.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
