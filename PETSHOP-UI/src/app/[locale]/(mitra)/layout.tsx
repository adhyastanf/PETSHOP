'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { Building2, Home, Store, Users } from 'lucide-react';
import DashboardLayout, { type NavItem } from '@/components/Layout/dashboard-layout';
import { useTranslations } from 'next-intl';
import { useMe } from '@/hooks/use-auth';
import { useBranches } from '@/features/merchant/query';

function MitraContent({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMe();
  const { data: branches, isLoading } = useBranches();

  const isSetupPage = pathname === '/mitra/setup';
  const isOwner = user?.roles?.includes('PETSHOP_OWNER') ?? false;

  // Redirect to setup if no branches and not already on setup page (owner only)
  useEffect(() => {
    if (!isLoading && branches !== undefined && branches.length === 0 && !isSetupPage && isOwner) {
      router.replace('/mitra/setup');
    }
  }, [branches, isLoading, isSetupPage, isOwner, router]);

  // Show loading while checking branches
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // If no branches and not on setup page, don't render (redirect will happen) — owner only
  if (isOwner && branches && branches.length === 0 && !isSetupPage) {
    return null;
  }

  // On setup page, render without sidebar
  if (isSetupPage) {
    return <>{children}</>;
  }

  const items: NavItem[] = [
    { href: '/mitra', label: t('common.home'), icon: Home },
    { href: '/mitra/profile', label: t('merchant.profile.title'), icon: Store },
    { href: '/mitra/branches', label: t('merchant.branch.title'), icon: Building2 },
    { href: '/mitra/staff', label: t('merchant.staff.title'), icon: Users },
  ];

  return (
    <DashboardLayout navItems={items} title="Oyen Mitra">
      {children}
    </DashboardLayout>
  );
}

export default function LayoutMitra({ children }: { children: React.ReactNode }) {
  // Route-level role protection for /mitra is enforced by the Next.js
  // middleware in src/proxy.ts (ROLE_PETSHOP_OWNER / ADMIN / STAFF / GROOMER /
  // VETERINARIAN), mirroring the backend @PreAuthorize on /api/v1/merchant/**.
  return <MitraContent>{children}</MitraContent>;
}
