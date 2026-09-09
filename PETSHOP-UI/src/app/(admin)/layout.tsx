'use client';

import { Home, Store, Stethoscope, Percent, CreditCard, SlidersHorizontal } from 'lucide-react';
import ProtectedRoute from '@/components/Provider/ProtectedRoute';
import DashboardLayout, { type NavItem } from '@/components/Layout/dashboard-layout';
import { useI18n } from '@/lib/i18n';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  const items: NavItem[] = [
    { href: '/admin/home', label: t('common.home'), icon: Home },
    { href: '/admin/merchants', label: t('merchant.verification.title'), icon: Store },
    { href: '/admin/veterinarians', label: t('merchant.verification.vetTitle'), icon: Stethoscope },
    { href: '/admin/commission-rules', label: t('config.nav.commissionRules'), icon: Percent },
    { href: '/admin/payment-methods', label: t('config.nav.paymentMethods'), icon: CreditCard },
    { href: '/admin/settings', label: t('config.nav.systemConfig'), icon: SlidersHorizontal },
  ];

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
      <DashboardLayout navItems={items} title="Oyen Admin">
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
