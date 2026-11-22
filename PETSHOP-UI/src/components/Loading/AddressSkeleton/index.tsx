import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AddressCardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex-row items-start justify-between gap-3 pb-3'>
        <div className='flex min-w-0 flex-col gap-2'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-4 w-28' />
        </div>
        <Skeleton className='size-8 rounded-md' />
      </CardHeader>
      <CardContent className='flex flex-col gap-2 pt-0'>
        <Skeleton className='h-4 w-4/5' />
        <Skeleton className='h-4 w-3/5' />
      </CardContent>
      <CardFooter className='justify-end gap-2'>
        <Skeleton className='h-7 w-20' />
        <Skeleton className='h-7 w-16' />
      </CardFooter>
    </Card>
  );
}
