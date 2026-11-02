'use client';

import { Home, Store, Stethoscope, Percent, CreditCard, SlidersHorizontal } from 'lucide-react';
import DashboardLayout, { type NavItem } from '@/components/Layout/dashboard-layout';
import { useTranslations } from 'next-intl';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  const items: NavItem[] = [
    { href: '/admin', label: t('common.home'), icon: Home },
    { href: '/admin/merchants', label: t('merchant.verification.title'), icon: Store },
    { href: '/admin/veterinarians', label: t('merchant.verification.vetTitle'), icon: Stethoscope },
    { href: '/admin/commission-rules', label: t('config.nav.commissionRules'), icon: Percent },
    { href: '/admin/payment-methods', label: t('config.nav.paymentMethods'), icon: CreditCard },
    { href: '/admin/settings', label: t('config.nav.systemConfig'), icon: SlidersHorizontal },
  ];

  // Route protection (SUPER_ADMIN/ADMIN) is enforced by the Next.js middleware
  // in src/proxy.ts for the /admin path group, replacing the old
  // <ProtectedRoute> wrapper that was removed in the frontend refactor.
  return (
    <DashboardLayout navItems={items} title="Oyen Admin">
      {children}
    </DashboardLayout>
  );
}
