import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/Provider/QueryProvider';
import AuthProvider from '@/components/Provider/AuthProvider';
import I18nProvider from '@/components/Provider/I18nProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Oyen',
  description: 'All Your Pet Needs, Closer to You.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col' suppressHydrationWarning>
        <QueryProvider>
          <I18nProvider>
            <AuthProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </AuthProvider>
          </I18nProvider>
          <Toaster position='top-right' richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
