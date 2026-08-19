'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PawPrint, Menu, X, LogOut } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useLogout } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import LanguageSwitcher from './language-switcher';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardLayout({ children, navItems, title }: DashboardLayoutProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex min-h-screen'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex h-full flex-col'>
          {/* Logo */}
          <div className='flex h-16 items-center gap-2 border-b border-border px-4'>
            <PawPrint className='size-6 text-primary' />
            <span className='text-lg font-bold'>{title}</span>
            <button
              className='ml-auto lg:hidden'
              onClick={() => setSidebarOpen(false)}
            >
              <X className='size-5' />
            </button>
          </div>

          {/* Navigation */}
          <nav className='flex-1 space-y-1 p-3'>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className='size-4' />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className='border-t border-border p-3'>
            <div className='mb-2 px-3'>
              <p className='text-sm font-medium truncate'>{user?.fullName}</p>
              <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className='flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground'
            >
              <LogOut className='size-4' />
              {t('common.signOut')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex flex-1 flex-col'>
        {/* Header */}
        <header className='flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6'>
          <button
            className='lg:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className='size-5' />
          </button>
          <div className='flex-1' />
          <LanguageSwitcher />
        </header>

        {/* Page content */}
        <main className='flex-1 p-4 lg:p-6'>
          {children}
        </main>
      </div>
    </div>
  );
}
