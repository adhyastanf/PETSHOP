import NavbarComponent from '@/components/Layout/menu-app';
import FooterComponent from '@/components/Layout/menu-footer';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export default function LayoutCustomer({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <NavbarComponent />
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8'>{children}</main>
      <Separator />
      <FooterComponent />
    </div>
  );
}
