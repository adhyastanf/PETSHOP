import { PawPrint } from 'lucide-react';

export default function FooterComponent() {
  return (
    <footer className='border-t border-border bg-card'>
      <div className='mx-auto max-w-7xl px-4 lg:px-8 py-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <PawPrint className='size-5 text-primary' />
            <span className='text-sm font-semibold'>Oyen</span>
          </div>
          <p className='text-xs text-muted-foreground'>
            &copy; {new Date().getFullYear()} Oyen. Semua Kebutuhan Hewan Peliharaan, Lebih Dekat.
          </p>
        </div>
      </div>
    </footer>
  );
}
