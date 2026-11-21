'use client';

import { useTranslations } from 'next-intl';

const BADGE_BASE = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

/** Active / inactive pill used by configuration and branch lists. */
export function ActiveBadge({ active, activeLabel, inactiveLabel }: { active: boolean; activeLabel: string; inactiveLabel: string }) {
  return <span className={`${BADGE_BASE} ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{active ? activeLabel : inactiveLabel}</span>;
}

const MERCHANT_STATUS_COLORS: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-800',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  SUSPENDED: 'bg-gray-100 text-gray-800',
  DRAFT: 'bg-gray-100 text-gray-600',
};

/** Merchant verification status pill. */
export function MerchantStatusBadge({ status }: { status: string }) {
  const t = useTranslations();
  return <span className={`${BADGE_BASE} ${MERCHANT_STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800'}`}>{t(`merchant.status.${status}`)}</span>;
}
