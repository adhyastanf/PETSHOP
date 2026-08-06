import MenuAppComponent from '@/components/Layout/menu-app';
import FooterComponent from '@/components/Layout/menu-footer';
import ProtectedRoute from '@/components/Provider/ProtectedRoute';
import React from 'react';

export default function LayoutCustomer({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN']}>
      <div className='flex flex-col min-h-screen'>
        <MenuAppComponent />
        <main className='flex-1 mx-auto max-w-7xl w-full px-4 lg:px-8 py-6'>{children}</main>
        <FooterComponent />
      </div>
    </ProtectedRoute>
  );
}
