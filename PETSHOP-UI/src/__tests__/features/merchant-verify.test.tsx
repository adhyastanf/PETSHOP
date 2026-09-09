import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the merchant service so no real network call happens.
vi.mock('@/features/merchant/merchant-service', () => ({
  merchantService: {
    verifyMerchant: vi.fn().mockResolvedValue({ id: 'm-1', verificationStatus: 'APPROVED' }),
    verifyVet: vi.fn().mockResolvedValue(undefined),
  },
}));

// Authenticated store so `enabled` gating in other hooks is harmless here.
vi.mock('@/store/auth-store', () => ({
  useAuthStore: Object.assign(
    () => ({ isAuthenticated: true }),
    { getState: () => ({ isAuthenticated: true }) }
  ),
}));

import { useVerifyMerchant, useVerifyVet } from '@/features/merchant/query';

function wrapperWith(qc: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
  };
}

describe('merchant verify cache invalidation (Bug C regression)', () => {
  let qc: QueryClient;

  beforeEach(() => {
    qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  });

  it('invalidates the admin applications key after verifying a merchant', async () => {
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useVerifyMerchant(), { wrapper: wrapperWith(qc) });

    result.current.mutate({ merchantId: 'm-1', data: { decision: 'APPROVED' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // The admin list query key must be invalidated so the UI updates instantly.
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'applications'] });
  });

  it('invalidates the admin veterinarians key after verifying a vet', async () => {
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useVerifyVet(), { wrapper: wrapperWith(qc) });

    result.current.mutate({ staffId: 's-1', data: { decision: 'VERIFIED' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['admin', 'veterinarians'] });
  });
});
