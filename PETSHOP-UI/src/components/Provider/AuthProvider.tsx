'use client';

import { useSessionRestore } from '@/hooks/use-session-restore';

/**
 * AuthProvider wraps the app and handles session restoration on mount.
 * Renders children immediately — individual protected layouts handle
 * the loading/redirect logic.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useSessionRestore();
  return <>{children}</>;
}
