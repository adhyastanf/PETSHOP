import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PetsModalFormSkeleton() {
  return (
    <Card className='w-full border-0 shadow-none'>
      <CardHeader className='px-0 pt-0'>
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-4 w-56' />
      </CardHeader>

      <CardContent className='space-y-4 px-0 pb-0'>
        {/* Form Fields */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Nama anabul */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Jenis anabul */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Ras */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Jenis kelamin */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Tanggal lahir */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Berat */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Warna */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Nomor microchip */}
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-9 w-full rounded-md' />
          </div>

          {/* Alergi */}
          <div className='col-span-1 space-y-2 md:col-span-2'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-20 w-full rounded-md' />
          </div>

          {/* Catatan khusus */}
          <div className='col-span-1 space-y-2 md:col-span-2'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-20 w-full rounded-md' />
          </div>

          {/* Checkbox */}
          <div className='flex items-center gap-2'>
            <Skeleton className='size-4 rounded-sm' />
            <Skeleton className='h-4 w-40' />
          </div>

          <div className='flex items-center gap-2'>
            <Skeleton className='size-4 rounded-sm' />
            <Skeleton className='h-4 w-32' />
          </div>
        </div>

        {/* Submit Button */}
        <Skeleton className='mt-2 h-12 w-full rounded-xl' />
      </CardContent>
    </Card>
  );
}
