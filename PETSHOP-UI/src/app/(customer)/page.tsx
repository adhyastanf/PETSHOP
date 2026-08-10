'use client';
import CardProduct from '@/components/Layout/item-card';
import CarouselComponent from '@/components/Layout/menu-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type ListTabsCustomerTypes = {
  value: string;
  label: string;
  component: React.ReactNode;
};

const listTabs: ListTabsCustomerTypes[] = [
  {
    value: 'semua',
    label: 'Semua',
    component: (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    ),
  },
  {
    value: 'makanan',
    label: 'Makanan',
    component: (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    ),
  },
  {
    value: 'grooming',
    label: 'Grooming',
    component: (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    ),
  },
  {
    value: 'vaksin',
    label: 'Vaksin',
    component: (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    ),
  },
  {
    value: 'aksesoris',
    label: 'Aksesoris',
    component: (
      <div className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 10 }).map((item, idx) => {
          return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' />;
        })}
      </div>
    ),
  },
];

export default function HomeCustomer() {
  return (
    <main className='py-10 space-y-10'>
      <CarouselComponent />
      <section className='flex justify-between items-center text-center max-w-270 mx-auto'>
        <div>
          <h2 className='text-2xl font-bold'>1.200+</h2>
          <p>Petshop Mitra</p>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>1.200+</h2>
          <p>Pelanggan Aktif</p>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>1.200+</h2>
          <p>Rating rata-rata</p>
        </div>
        <div>
          <h2 className='text-2xl font-bold'>1.200+</h2>
          <p>Pesanan Tepat Waktu</p>
        </div>
      </section>

      <section className='space-y-4'>
        <div>
          <h2 className='text-2xl font-bold'>Semua Kebutuhan hewanmu, di satu tempat</h2>
          <h2>Dari belanja sampai perawatan, langsung dari petshop mitra terverifikasi.</h2>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
          <Card className=''>
            <CardContent className='flex gap-2'>
              <Button size='icon'>
                <ShoppingBag />
              </Button>
              <div className='flex justify-between flex-1'>
                <div>
                  <p className='font-bold'>Beli Produk</p>
                  <p>Ribuan produk asli, kirim cepat</p>
                </div>
                <ArrowRight />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>Petshop Terdekat</h3>
          <Link href='/' className='flex items-center gap-1'>
            Lihat Semua
            <ArrowRight />
          </Link>
        </div>
        <div className='flex overflow-auto gap-4'>
          {Array.from({ length: 15 }).map((item, idx) => {
            return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' className='w-60 shrink-0' />;
          })}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-2xl font-bold'>Produk Popular</h3>
          <Link href='/' className='flex items-center gap-1'>
            Lihat Semua
            <ArrowRight />
          </Link>
        </div>
        <div className='flex overflow-auto gap-4'>
          {Array.from({ length: 15 }).map((item, idx) => {
            return <CardProduct key={idx} title={`MITRA `.concat('1')} description='2' className='w-60 shrink-0' />;
          })}
        </div>
      </div>

      <Card className='bg-orange-400 px-6 py-10'>
        <CardContent className='flex justify-between items-center'>
          <div className='space-y-4'>
            <h3 className='text-3xl font-bold'>Punya Petshop Sendiri?</h3>
            <p>Gabung jadi mitra dan buka kanal jualan baru.</p>
          </div>
          <Button className='px-4 py-5 rounded-full'>Daftar Jadi Mitra</Button>
        </CardContent>
      </Card>

      <TabsComponent list={listTabs} variant='line' />
    </main>
  );
}

type TabsComponentProps = {
  list: ListTabsCustomerTypes[];
  variant?: 'line' | 'default' | null | undefined;
  defaultValue?: string | null | undefined;
};

function TabsComponent({ list = [], variant = 'default', defaultValue = undefined }: TabsComponentProps) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList variant={variant} className='mb-4 gap-6'>
        {list.map((item, idx) => {
          return (
            <TabsTrigger key={idx} value={item.value} className='text-lg cursor-pointer font-bold'>
              {item.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {list.map((item, idx) => {
        return (
          <TabsContent key={idx} value={item.value} className=''>
            {item.component}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
