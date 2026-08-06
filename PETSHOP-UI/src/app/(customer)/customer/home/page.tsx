import { PawPrint } from 'lucide-react';

export default function HomeCustomer() {
  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold'>Selamat Datang di Oyen</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Temukan produk dan layanan untuk hewan peliharaan Anda.
        </p>
      </div>

      {/* Placeholder — will be replaced with real content in later phases */}
      <div className='flex flex-col items-center justify-center py-16 text-center'>
        <PawPrint className='size-12 text-muted-foreground/40' />
        <p className='mt-4 text-lg font-medium'>Segera hadir</p>
        <p className='mt-1 text-sm text-muted-foreground'>
          Produk, layanan, dan petshop terdekat akan muncul di sini.
        </p>
      </div>
    </div>
  );
}
