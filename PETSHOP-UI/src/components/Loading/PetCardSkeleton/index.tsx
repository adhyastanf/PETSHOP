import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PetCardSkeleton() {
  return (
    <Card className='flex h-auto w-full flex-col border-0'>
      <CardHeader>
        <Skeleton className='h-36 w-full rounded-xl sm:h-40' />
      </CardHeader>

      <CardContent className='flex flex-1 flex-col items-start space-y-1.5'>
        <div className='flex items-center gap-1'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='size-5 rounded-full' />
        </div>

        <Skeleton className='h-4 w-24' />

        <div className='flex flex-wrap items-center gap-1'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
          <Skeleton className='h-5 w-14 rounded-full' />
        </div>
        <Skeleton className='h-5 w-32 rounded-full' />
        <Skeleton className='mt-2 h-8 w-full rounded-md' />
      </CardContent>
    </Card>
  );
}
