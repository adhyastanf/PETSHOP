import { AppSidebar } from '@/components/app-sidebar';
import ProtectedRoute from '@/components/Provider/ProtectedRoute';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function LayoutMitra({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['PETSHOP_OWNER', 'PETSHOP_ADMIN', 'PETSHOP_STAFF', 'GROOMER', 'VETERINARIAN']}>
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant='inset' />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
