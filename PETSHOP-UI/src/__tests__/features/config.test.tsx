import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { I18nContext, createTranslator } from '@/lib/i18n';

// ---- Mock the config query hooks used by the pages ----
const mockSetPaymentActive = vi.fn();
const mockSetCommissionActive = vi.fn();
const mockCreateCommission = vi.fn();
const mockUpdateConfig = vi.fn();

vi.mock('@/features/config/query', () => ({
  usePaymentMethods: () => ({
    data: [
      { id: 'pm-1', providerCode: 'XENDIT', methodCode: 'QRIS', name: 'QRIS', type: 'EWALLET', isActive: true, sortOrder: 1 },
      { id: 'pm-2', providerCode: 'COD', methodCode: 'COD', name: 'Cash on Delivery', type: 'COD', isActive: true, sortOrder: 99 },
    ],
    isLoading: false,
    isError: false,
  }),
  useSetPaymentMethodActive: () => ({ mutate: mockSetPaymentActive, isPending: false, variables: undefined }),
  useCommissionRules: () => ({
    data: [
      { id: 'cr-1', transactionType: 'PRODUCT', scope: 'GLOBAL', merchantId: null, categoryId: null, commissionType: 'PERCENTAGE', commissionValue: 4, priority: 0, validFrom: null, validUntil: null, isActive: true },
    ],
    isLoading: false,
    isError: false,
  }),
  useCreateCommissionRule: () => ({ mutate: mockCreateCommission, isPending: false }),
  useSetCommissionRuleActive: () => ({ mutate: mockSetCommissionActive, isPending: false, variables: undefined }),
  useSystemConfig: () => ({
    data: [
      { key: 'checkout_expiration_minutes', value: '30', valueType: 'INTEGER', description: null, min: '1', max: '1440', isPublic: false, updatedAt: null },
    ],
    isLoading: false,
    isError: false,
  }),
  useUpdateSystemConfig: () => ({ mutate: mockUpdateConfig, isPending: false }),
}));

import AdminPaymentMethodsPage from '@/app/(admin)/admin/payment-methods/page';
import AdminCommissionRulesPage from '@/app/(admin)/admin/commission-rules/page';
import AdminSettingsPage from '@/app/(admin)/admin/settings/page';

function renderWithI18n(ui: React.ReactElement) {
  const t = createTranslator('en');
  return render(
    <I18nContext.Provider value={{ locale: 'en', setLocale: () => {}, t }}>
      {ui}
    </I18nContext.Provider>
  );
}

describe('Business Configuration admin pages', () => {
  beforeEach(() => {
    mockSetPaymentActive.mockClear();
    mockSetCommissionActive.mockClear();
    mockCreateCommission.mockClear();
    mockUpdateConfig.mockClear();
  });

  it('renders payment methods with XENDIT provider and COD, and toggles availability', () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    // Backend-served availability is displayed (no hardcoded flags)
    expect(screen.getByText('XENDIT')).toBeInTheDocument();
    expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();

    // Toggling calls the mutation (backend authoritative)
    const deactivateButtons = screen.getAllByRole('button', { name: 'Deactivate' });
    fireEvent.click(deactivateButtons[0]);
    expect(mockSetPaymentActive).toHaveBeenCalledWith(
      { id: 'pm-1', isActive: false },
      expect.anything()
    );
  });

  it('renders commission rules list with resolved scope and value', () => {
    renderWithI18n(<AdminCommissionRulesPage />);

    expect(screen.getByText('Commission Rules')).toBeInTheDocument();
    expect(screen.getByText('GLOBAL')).toBeInTheDocument();
    expect(screen.getByText('4%')).toBeInTheDocument();
    // Historical safety note is surfaced to the admin
    expect(
      screen.getByText(/Historical commission is snapshotted/i)
    ).toBeInTheDocument();
  });

  it('submits a new commission rule through the create form', () => {
    renderWithI18n(<AdminCommissionRulesPage />);

    fireEvent.click(screen.getByRole('button', { name: /Create rule/i }));
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /^Create$/i }));

    expect(mockCreateCommission).toHaveBeenCalled();
    const payload = mockCreateCommission.mock.calls[0][0];
    expect(payload.commissionValue).toBe(5);
    expect(payload.transactionType).toBe('PRODUCT');
  });

  it('renders system business settings and saves a value', () => {
    renderWithI18n(<AdminSettingsPage />);

    expect(screen.getByText('Business Settings')).toBeInTheDocument();
    expect(screen.getByText('Unpaid checkout expiration (minutes)')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockUpdateConfig).toHaveBeenCalledWith(
      { key: 'checkout_expiration_minutes', value: '30' },
      expect.anything()
    );
  });
});
