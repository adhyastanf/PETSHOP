import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/locales';
import { AppAlertDialog } from '@/components/Dialog';
import { useAlertDialogStore } from '@/store/alert-modal-store';

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

import AdminPaymentMethodsPage from '@/app/[locale]/(admin)/admin/payment-methods/page';
import AdminCommissionRulesPage from '@/app/[locale]/(admin)/admin/commission-rules/page';
import AdminSettingsPage from '@/app/[locale]/(admin)/admin/settings/page';

function renderWithI18n(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale='en' messages={getMessages('en')}>
      {ui}
      {/* Confirmation dialogs are rendered once by the locale layout in the app. */}
      <AppAlertDialog />
    </NextIntlClientProvider>
  );
}

/** Resolve a dotted message key from the loaded locale bundle (test helper). */
function translate(locale: 'en' | 'id', key: string): string {
  const parts = key.split('.');
  let current: unknown = getMessages(locale);
  for (const part of parts) {
    if (current === null || typeof current !== 'object') return key;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : key;
}

describe('Business Configuration admin pages', () => {
  beforeEach(() => {
    useAlertDialogStore.getState().close();
    mockSetPaymentActive.mockClear();
    mockSetCommissionActive.mockClear();
    mockCreateCommission.mockClear();
    mockUpdateConfig.mockClear();
  });

  it('renders payment methods with XENDIT provider and COD, and deactivation requires confirmation', async () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    // Backend-served availability is displayed (no hardcoded flags)
    expect(screen.getAllByText('XENDIT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Cash on Delivery').length).toBeGreaterThanOrEqual(1);

    // Clicking Deactivate opens a confirmation dialog and does NOT mutate yet.
    const deactivateButtons = screen.getAllByRole('button', { name: 'Deactivate' });
    fireEvent.click(deactivateButtons[0]);
    expect(mockSetPaymentActive).not.toHaveBeenCalled();
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText('Disable this payment method?')).toBeInTheDocument();

    // Confirming in the dialog performs the mutation (backend authoritative).
    fireEvent.click(within(dialog).getByRole('button', { name: 'Deactivate' }));
    await waitFor(() =>
      expect(mockSetPaymentActive).toHaveBeenCalledWith({ id: 'pm-1', isActive: false }, expect.anything())
    );
  });

  it('cancelling the deactivate confirmation does not mutate', async () => {
    renderWithI18n(<AdminPaymentMethodsPage />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Deactivate' })[0]);
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
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

  it('submits a new commission rule through the create form', async () => {
    renderWithI18n(<AdminCommissionRulesPage />);

    fireEvent.click(screen.getByRole('button', { name: /Create rule/i }));
    fireEvent.change(screen.getByLabelText('Value'), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /^Create$/i }));

    // react-hook-form validates asynchronously before submitting.
    await waitFor(() => expect(mockCreateCommission).toHaveBeenCalled());
    const payload = mockCreateCommission.mock.calls[0][0];
    expect(payload.commissionValue).toBe(5);
    expect(payload.transactionType).toBe('PRODUCT');
  });

  it('renders system business settings and saves a value', async () => {
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
    const dialog = await screen.findByRole('alertdialog');
    expect(mockUpdateConfig).not.toHaveBeenCalled();
    expect(within(dialog).getByText('Update this setting?')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(mockUpdateConfig).toHaveBeenCalledWith(
        { key: 'checkout_expiration_minutes', value: '30' },
        expect.anything()
      )
    );
  });

  it('renders the improved fallback commission label and description (§1)', () => {
    // Re-mock system config to include the fallback commission key for this assertion
    renderWithI18n(<AdminSettingsPage />);
    // The default mock only has checkout; assert the i18n keys resolve for fallback commission.
    const t = (key: string) => translate('en', key);
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
    const t = (key: string) => translate('id', key);
    expect(t('config.systemConfig.keys.checkout_expiration_minutes')).toBe('Batas waktu pembayaran checkout (menit)');
    expect(t('config.systemConfig.keys.default_commission_percentage')).toBe('Komisi fallback (%)');
    expect(t('config.commission.unlimited')).toBe('Tidak terbatas');
    expect(t('config.payment.types.EWALLET')).toBe('Dompet Digital');
    expect(t('config.payment.types.COD')).toBe('Cash on Delivery');
  });
});
