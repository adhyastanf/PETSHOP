import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ShieldX } from 'lucide-react';

export default async function Forbidden() {
  const t = await getTranslations('error.forbidden');

  return (
    <main className='flex min-h-[60vh] items-center justify-center px-4 py-12'>
      <Card className='w-full max-w-md text-center'>
        <CardHeader className='items-center gap-4'>
          <div className='flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <ShieldX aria-hidden='true' className='size-8' />
          </div>
          <div className='flex flex-col gap-2'>
            <CardTitle className='text-2xl'>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button render={<Link href='/' />} nativeButton={false}>
            {t('homeAction')}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
