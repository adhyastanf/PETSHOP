'use client';

import { Home, Store, Stethoscope } from 'lucide-react';
import ProtectedRoute from '@/components/Provider/ProtectedRoute';
import DashboardLayout, { type NavItem } from '@/components/Layout/dashboard-layout';
import { useI18n } from '@/lib/i18n';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const items: NavItem[] = [
    { href: '/admin/home', label: t('common.home'), icon: Home },
    { href: '/admin/merchants', label: t('merchant.verification.title'), icon: Store },
    { href: '/admin/veterinarians', label: t('merchant.verification.vetTitle'), icon: Stethoscope },
  ];

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout navItems={items} title="Oyen Admin">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
