import { apiClient } from '@/lib/api-client';
import type {
  SystemConfig,
  CommissionRule,
  CreateCommissionRuleRequest,
  PaymentMethod,
} from './types';

/**
 * Service layer for the admin Business Configuration APIs.
 * All values are backend-authoritative; the frontend never computes business
 * or financial values — it only reads and edits configuration through these
 * endpoints.
 */
export const configService = {
  // System business configuration
  listConfig(): Promise<SystemConfig[]> {
    return apiClient<SystemConfig[]>('/admin/config');
  },
  updateConfig(key: string, value: string): Promise<SystemConfig> {
    return apiClient<SystemConfig>(`/admin/config/${key}`, { method: 'PUT', body: { value } });
  },

  // Commission rules
  listCommissionRules(): Promise<CommissionRule[]> {
    return apiClient<CommissionRule[]>('/admin/commission-rules');
  },
  createCommissionRule(data: CreateCommissionRuleRequest): Promise<CommissionRule> {
    return apiClient<CommissionRule>('/admin/commission-rules', { method: 'POST', body: data });
  },
  activateCommissionRule(id: string): Promise<CommissionRule> {
    return apiClient<CommissionRule>(`/admin/commission-rules/${id}/activate`, { method: 'POST' });
  },
  deactivateCommissionRule(id: string): Promise<CommissionRule> {
    return apiClient<CommissionRule>(`/admin/commission-rules/${id}/deactivate`, { method: 'POST' });
  },

  // Payment methods
  listPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient<PaymentMethod[]>('/admin/payment-methods');
  },
  setPaymentMethodActive(id: string, isActive: boolean): Promise<PaymentMethod> {
    return apiClient<PaymentMethod>(`/admin/payment-methods/${id}`, { method: 'PATCH', body: { isActive } });
  },
};
