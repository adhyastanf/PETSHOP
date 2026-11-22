import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PetCardSkeleton() {
  return (
    <Card className='h-full'>
      <CardHeader className='pb-0'>
        <Skeleton className='h-36 w-full rounded-md sm:h-40' />
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-4 w-24' />
        </div>
        <div className='grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3'>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
