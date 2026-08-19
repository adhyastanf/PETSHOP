import { PawPrint } from 'lucide-react';

export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <PawPrint className='size-8 text-primary animate-pulse' />
        <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    </div>
  );
}
