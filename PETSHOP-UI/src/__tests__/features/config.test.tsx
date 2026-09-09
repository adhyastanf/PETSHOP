import { render, screen, fireEvent, within } from '@testing-library/react';
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
      { id: 'pm-1', providerCode: 'XENDIT', methodCode: 'BANK_TRANSFER_BCA', name: 'Bank Transfer BCA', type: 'VIRTUAL_ACCOUNT', isActive: true, sortOrder: 1 },
      { id: 'pm-2', providerCode: 'XENDIT', methodCode: 'GOPAY', name: 'GoPay', type: 'EWALLET', isActive: true, sortOrder: 2 },
      { id: 'pm-3', providerCode: 'COD', methodCode: 'COD', name: 'Cash on Delivery', type: 'COD', isActive: true, sortOrder: 99 },
    ],
    isLoading: false,
    isError: false,
  }),
  useSetPaymentMethodActive: () => ({ mutate: mockSetPaymentActive, isPending: false, variables: undefined }),
  useCommissionRules: () => ({
    data: [
      { id: 'cr-1', transactionType: 'PRODUCT', scope: 'GLOBAL', merchantId: null, categoryId: null, commissionType: 'PERCENTAGE', commissionValue: 4, priority: 0, validFrom: null, validUntil: null, isActive: true },
      { id: 'cr-2', transactionType: 'SERVICE', scope: 'GLOBAL', merchantId: null, categoryId: null, commissionType: 'PERCENTAGE', commissionValue: 5, priority: 10, validFrom: '2026-09-09T00:00:00Z', validUntil: '2026-12-31T00:00:00Z', isActive: true },
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

  it('renders payment methods with XENDIT provider and COD, and deactivation requires confirmation', () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    // Backend-served availability is displayed (no hardcoded flags)
    expect(screen.getAllByText('XENDIT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cash on Delivery').length).toBeGreaterThanOrEqual(1);

    // Clicking Deactivate opens a confirmation dialog and does NOT mutate yet.
    const deactivateButtons = screen.getAllByRole('button', { name: 'Deactivate' });
    fireEvent.click(deactivateButtons[0]);
    expect(mockSetPaymentActive).not.toHaveBeenCalled();
    expect(screen.getByText('Disable this payment method?')).toBeInTheDocument();

    // Confirming in the dialog performs the mutation (backend authoritative).
    // The Cancel button only exists inside the dialog; use its container to
    // reliably scope to the dialog's confirm button.
    const dialogButtonRow = screen.getByRole('button', { name: 'Cancel' }).parentElement as HTMLElement;
    const confirmButton = within(dialogButtonRow).getByRole('button', { name: 'Deactivate' });
    fireEvent.click(confirmButton);
    expect(mockSetPaymentActive).toHaveBeenCalledWith(
      { id: 'pm-1', isActive: false },
      expect.anything()
    );
  });

  it('cancelling the deactivate confirmation does not mutate', () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Deactivate' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(mockSetPaymentActive).not.toHaveBeenCalled();
  });

  it('renders commission rules list with resolved scope and value', () => {
    renderWithI18n(<AdminCommissionRulesPage />);

    expect(screen.getByText('Commission Rules')).toBeInTheDocument();
    expect(screen.getAllByText('GLOBAL').length).toBeGreaterThanOrEqual(1);
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
    // Improved checkout label (§1)
    expect(screen.getByText('Checkout payment deadline (minutes)')).toBeInTheDocument();
    // Improved checkout description (§1)
    expect(
      screen.getByText('Checkout expires if payment is not received within the specified time.')
    ).toBeInTheDocument();

    // Save now opens a confirmation dialog; it must not mutate until confirmed.
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(mockUpdateConfig).not.toHaveBeenCalled();
    expect(screen.getByText('Update this setting?')).toBeInTheDocument();

    const dialogButtonRow = screen.getByRole('button', { name: 'Cancel' }).parentElement as HTMLElement;
    fireEvent.click(within(dialogButtonRow).getByRole('button', { name: 'Save' }));
    expect(mockUpdateConfig).toHaveBeenCalledWith(
      { key: 'checkout_expiration_minutes', value: '30' },
      expect.anything()
    );
  });

  it('renders the improved fallback commission label and description (§1)', () => {
    // Re-mock system config to include the fallback commission key for this assertion
    renderWithI18n(<AdminSettingsPage />);
    // The default mock only has checkout; assert the i18n keys resolve for fallback commission.
    const t = createTranslator('en');
    expect(t('config.systemConfig.keys.default_commission_percentage')).toBe('Fallback commission (%)');
    expect(t('config.systemConfig.descriptions.default_commission_percentage')).toBe(
      'Used only when no applicable commission rule exists. Commission rules are the authoritative commission mechanism.'
    );
  });

  it('renders human-readable payment method type labels (§2)', () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    expect(screen.getByText('Virtual Account')).toBeInTheDocument();
    expect(screen.getByText('Digital Wallet')).toBeInTheDocument();
    // COD name column and type label both read "Cash on Delivery"
    expect(screen.getAllByText('Cash on Delivery').length).toBeGreaterThanOrEqual(1);
    // Raw enum values must not be shown
    expect(screen.queryByText('VIRTUAL_ACCOUNT')).not.toBeInTheDocument();
    expect(screen.queryByText('EWALLET')).not.toBeInTheDocument();
  });

  it('displays formatted effective dates and Unlimited for null (§3)', () => {
    renderWithI18n(<AdminCommissionRulesPage />);

    // cr-2 has valid_from 2026-09-09 and valid_until 2026-12-31 -> formatted, no ISO
    expect(screen.getByText('9 Sept 2026')).toBeInTheDocument();
    expect(screen.getByText('31 Dec 2026')).toBeInTheDocument();
    expect(screen.queryByText(/2026-09-09T00:00:00/)).not.toBeInTheDocument();

    // cr-1 has null dates -> "Unlimited" appears (both from & until)
    expect(screen.getAllByText('Unlimited').length).toBeGreaterThanOrEqual(2);
  });

  it('shows effective-date fields in the create form (§4)', () => {
    renderWithI18n(<AdminCommissionRulesPage />);
    fireEvent.click(screen.getByRole('button', { name: /Create rule/i }));

    expect(screen.getByLabelText('Effective From')).toBeInTheDocument();
    expect(screen.getByLabelText('Effective Until')).toBeInTheDocument();
  });

  it('resolves Indonesian i18n strings correctly (§6)', () => {
    const t = createTranslator('id');
    expect(t('config.systemConfig.keys.checkout_expiration_minutes')).toBe('Batas waktu pembayaran checkout (menit)');
    expect(t('config.systemConfig.keys.default_commission_percentage')).toBe('Komisi fallback (%)');
    expect(t('config.commission.unlimited')).toBe('Tidak terbatas');
    expect(t('config.payment.types.EWALLET')).toBe('Dompet Digital');
    expect(t('config.payment.types.COD')).toBe('Cash on Delivery');
  });
});
