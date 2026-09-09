'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { configService } from './config-service';
import type { CreateCommissionRuleRequest } from './types';

export const CONFIG_KEYS = {
  systemConfig: ['config', 'system'] as const,
  commissionRules: ['config', 'commission-rules'] as const,
  paymentMethods: ['config', 'payment-methods'] as const,
};

// ===== System business configuration =====

export function useSystemConfig() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: CONFIG_KEYS.systemConfig,
    queryFn: configService.listConfig,
    enabled: isAuthenticated,
  });
}

export function useUpdateSystemConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      configService.updateConfig(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEYS.systemConfig }),
  });
}

// ===== Commission rules =====

export function useCommissionRules() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: CONFIG_KEYS.commissionRules,
    queryFn: configService.listCommissionRules,
    enabled: isAuthenticated,
  });
}

export function useCreateCommissionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommissionRuleRequest) => configService.createCommissionRule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEYS.commissionRules }),
  });
}

export function useSetCommissionRuleActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active
        ? configService.activateCommissionRule(id)
        : configService.deactivateCommissionRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEYS.commissionRules }),
  });
}

// ===== Payment methods =====

export function usePaymentMethods() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: CONFIG_KEYS.paymentMethods,
    queryFn: configService.listPaymentMethods,
    enabled: isAuthenticated,
  });
}

export function useSetPaymentMethodActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      configService.setPaymentMethodActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEYS.paymentMethods }),
  });
}
