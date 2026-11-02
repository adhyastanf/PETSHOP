import { Skeleton } from '@/components/ui/skeleton';

export default function FormProfileSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
      <div className='flex justify-end'>
        <Skeleton className='h-9 w-20' />
      </div>
    </div>
  );
}
