import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

export default function CardProduct({ title, description, textButton = 'Check it Out', className }: CardProductTypes) {
  return (
    <Card className={cn('relative pt-0', className)}>
      <div className='absolute inset-0 z-30 aspect-video bg-black/35' />
      <img src='https://avatar.vercel.sh/shadcn1' alt='Event cover' className='relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40' />
      <CardHeader>
        <CardAction>
          <Badge variant='secondary'>Featured</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className='w-full'>
        <Link href={`/product/`.concat('1')} className='w-full cursor-pointer'>
          <Button className='w-full cursor-pointer'>{textButton}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

type CardProductTypes = {
  title: string;
  description: string;
  textButton?: string;
  className?: string;
};
