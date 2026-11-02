import { PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
      <div className='mb-6 flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <PawPrint className='size-8 text-primary' />
          <span className='text-2xl font-bold text-foreground'>Oyen</span>
        </div>
        <p className='text-sm text-muted-foreground'>{t('common.tagline')}</p>
      </div>
      <div className='w-full max-w-md'>{children}</div>
    </div>
  );
}
