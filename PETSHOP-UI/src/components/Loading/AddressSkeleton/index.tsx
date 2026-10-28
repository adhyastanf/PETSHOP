import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddressCardSkeleton() {
  return (
    <Card className='relative border-2 border-slate-100 shadow-sm overflow-hidden bg-white'>
      <CardContent className='p-6'>
        {/* Garis Aksen Vertikal Skeleton di Kiri */}
        <Skeleton className='absolute left-0 top-0 bottom-0 w-1.5' />

        <div className='flex justify-between items-start'>
          <div className='flex-1 space-y-3'>
            {/* Header Alamat & Badge Skeleton */}
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-32' /> {/* Label Alamat (Rumah/Kantor) */}
              <Skeleton className='h-5 w-14 rounded-full' /> {/* Badge Utama */}
            </div>

            {/* Penerima, Telepon, & Alamat Skeleton */}
            <div className='space-y-1.5'>
              <Skeleton className='h-4 w-40 ' /> {/* Nama Penerima */}
              <Skeleton className='h-3.5 w-28 ' /> {/* No Telepon */}
              <Skeleton className='h-4 w-3/4 mt-2' /> {/* Alamat Baris 1 */}
              <Skeleton className='h-4 w-1/2' /> {/* Alamat Baris 2 */}
            </div>

            {/* Footer Card: Tombol Aksi Skeleton */}
            <div className='flex items-center gap-3 pt-1'>
              <Skeleton className='h-8 w-24' /> {/* Tombol Ubah */}
              <Skeleton className='h-4 w-px' /> {/* Separator */}
              <Skeleton className='h-8 w-36' /> {/* Tombol Jadikan Utama */}
              <Skeleton className='h-4 w-px' /> {/* Separator */}
              <Skeleton className='h-8 w-16' /> {/* Tombol Hapus */}
            </div>
          </div>

          {/* Indikator Tombol Pilih Skeleton di Kanan */}
          <div className='ml-4'>
            <Skeleton className='h-9 w-16' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}