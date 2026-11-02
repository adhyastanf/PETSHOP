import api from '@/lib/api';
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
 * endpoints. Requests go through the axios instance in `@/lib/api` (same-origin
 * Next.js proxy + httpOnly-cookie auth). Endpoints are relative to the backend
 * API base (e.g. `/admin/config`).
 */
export const configService = {
  // System business configuration
  async listConfig(): Promise<SystemConfig[]> {
    return (await api.get<SystemConfig[]>('/admin/config')).data;
  },
  async updateConfig(key: string, value: string): Promise<SystemConfig> {
    return (await api.put<SystemConfig>(`/admin/config/${key}`, { value })).data;
  },

  // Commission rules
  async listCommissionRules(): Promise<CommissionRule[]> {
    return (await api.get<CommissionRule[]>('/admin/commission-rules')).data;
  },
  async createCommissionRule(data: CreateCommissionRuleRequest): Promise<CommissionRule> {
    return (await api.post<CommissionRule>('/admin/commission-rules', data)).data;
  },
  async activateCommissionRule(id: string): Promise<CommissionRule> {
    return (await api.post<CommissionRule>(`/admin/commission-rules/${id}/activate`)).data;
  },
  async deactivateCommissionRule(id: string): Promise<CommissionRule> {
    return (await api.post<CommissionRule>(`/admin/commission-rules/${id}/deactivate`)).data;
  },

  // Payment methods
  async listPaymentMethods(): Promise<PaymentMethod[]> {
    return (await api.get<PaymentMethod[]>('/admin/payment-methods')).data;
  },
  async setPaymentMethodActive(id: string, isActive: boolean): Promise<PaymentMethod> {
    return (await api.patch<PaymentMethod>(`/admin/payment-methods/${id}`, { isActive })).data;
  },
};
