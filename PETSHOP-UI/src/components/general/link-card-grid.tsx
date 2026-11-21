'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/lib/i18n/navigation';
import type { LucideIcon } from 'lucide-react';

export type LinkCardItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

/** Grid of navigation cards used by the admin and mitra dashboards. */
export function LinkCardGrid({ links }: { links: LinkCardItem[] }) {
  return (
    <div className='grid gap-4 md:grid-cols-3'>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          <Card className='cursor-pointer transition-colors hover:bg-muted/50'>
            <CardContent>
              <div className='flex items-center gap-3'>
                <link.icon className='size-5 text-muted-foreground' />
                <span className='font-medium'>{link.label}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
