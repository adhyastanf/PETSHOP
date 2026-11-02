'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/hooks/use-auth';
import { configService } from './config-service';
import type { CreateCommissionRuleRequest } from './types';

export const CONFIG_KEYS = {
  systemConfig: ['config', 'system'] as const,
  commissionRules: ['config', 'commission-rules'] as const,
  paymentMethods: ['config', 'payment-methods'] as const,
};

// ===== System business configuration =====

export function useSystemConfig() {
  const { data: me } = useMe();
  return useQuery({
    queryKey: CONFIG_KEYS.systemConfig,
    queryFn: configService.listConfig,
    enabled: !!me,
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
  const { data: me } = useMe();
  return useQuery({
    queryKey: CONFIG_KEYS.commissionRules,
    queryFn: configService.listCommissionRules,
    enabled: !!me,
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
  const { data: me } = useMe();
  return useQuery({
    queryKey: CONFIG_KEYS.paymentMethods,
    queryFn: configService.listPaymentMethods,
    enabled: !!me,
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
