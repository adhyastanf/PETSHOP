import { PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen bg-background px-4 py-10'>
      <section className='mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-8'>
        <div className='max-w-2xl'>
          <div className='flex items-center gap-2'>
            <PawPrint className='size-8 text-primary' />
            <span className='text-2xl font-bold'>Oyen</span>
          </div>
          <h1 className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl text-foreground'>
            Semua Kebutuhan Hewan Peliharaan, Lebih Dekat.
          </h1>
          <p className='mt-4 text-lg leading-8 text-muted-foreground'>
            Marketplace produk dan layanan hewan peliharaan untuk customer, mitra petshop, dan admin.
          </p>
        </div>
        <nav className='grid gap-3 sm:grid-cols-3'>
          <Link
            className='rounded-xl border border-border bg-card p-5 font-medium hover:shadow-md transition-shadow'
            href='/customer/home'
          >
            Customer
          </Link>
          <Link
            className='rounded-xl border border-border bg-card p-5 font-medium hover:shadow-md transition-shadow'
            href='/mitra/home'
          >
            Mitra
          </Link>
          <Link
            className='rounded-xl border border-border bg-card p-5 font-medium hover:shadow-md transition-shadow'
            href='/admin/home'
          >
            Admin
          </Link>
        </nav>
      </section>
    </main>
  );
}
