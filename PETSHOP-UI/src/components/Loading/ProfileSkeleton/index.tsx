import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function FormProfileSkeleton() {
  return (
    <div className='flex flex-col gap-5' aria-busy='true'>
      <Card>
        <CardContent className='flex items-center gap-4 p-5 sm:p-6'>
          <Skeleton className='size-14 rounded-full' />
          <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <Skeleton className='h-5 w-40 max-w-full' />
            <Skeleton className='h-4 w-52 max-w-full' />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='gap-2'>
          <Skeleton className='h-5 w-36' />
          <Skeleton className='h-4 w-64 max-w-full' />
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-9 w-full' />
              </div>
            ))}
          </div>
          <div className='flex justify-end border-t pt-4'>
            <Skeleton className='h-9 w-20' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
