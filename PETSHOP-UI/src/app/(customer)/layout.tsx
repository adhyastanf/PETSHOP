import MenuAppComponent from '@/components/Layout/menu-app';
import FooterComponent from '@/components/Layout/menu-footer';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export default function LayoutCustomer({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col'>
      <MenuAppComponent />
      <main className='mx-auto max-w-300 w-full'>{children}</main>
      <Separator />
      <FooterComponent />
    </div>
  );
}
