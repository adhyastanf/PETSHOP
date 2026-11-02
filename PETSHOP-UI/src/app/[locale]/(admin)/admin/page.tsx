'use client';

import { Store, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminHomePage() {
  const { t } = useI18n();

  const links = [
    { href: '/admin/merchants', icon: Store, label: t('merchant.verification.title') },
    { href: '/admin/veterinarians', icon: Stethoscope, label: t('merchant.verification.vetTitle') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform administration</p>
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
