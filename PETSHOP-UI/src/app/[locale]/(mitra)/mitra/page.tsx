'use client';

import Link from 'next/link';
import { Building2, Store, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export default function MitraHomePage() {
  const { t } = useI18n();

  const links = [
    { href: '/mitra/profile', icon: Store, label: t('merchant.profile.title') },
    { href: '/mitra/branches', icon: Building2, label: t('merchant.branch.title') },
    { href: '/mitra/staff', icon: Users, label: t('merchant.staff.title') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t('common.home')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Merchant Dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent>
                <div className="flex items-center gap-3">
                  <link.icon className="size-5 text-muted-foreground" />
                  <span className="font-medium">{link.label}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
