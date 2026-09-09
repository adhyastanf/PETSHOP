/**
 * Types for the Business Configuration admin feature.
 * These mirror the backend DTOs under com.petshop.api.businessconfig.
 */

export interface SystemConfig {
  key: string;
  value: string | null;
  valueType: 'INTEGER' | 'DECIMAL' | 'BOOLEAN';
  description: string | null;
  min: string | null;
  max: string | null;
  isPublic: boolean;
  updatedAt: string | null;
}

export interface UpdateSystemConfigRequest {
  value: string;
}

export type CommissionTransactionType = 'PRODUCT' | 'SERVICE';
export type CommissionType = 'PERCENTAGE' | 'FIXED';
export type CommissionScope = 'GLOBAL' | 'CATEGORY' | 'MERCHANT';

export interface CommissionRule {
  id: string;
  transactionType: CommissionTransactionType;
  scope: CommissionScope;
  merchantId: string | null;
  categoryId: string | null;
  commissionType: CommissionType;
  commissionValue: number;
  priority: number | null;
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
}

export interface CreateCommissionRuleRequest {
  transactionType: CommissionTransactionType;
  commissionType: CommissionType;
  commissionValue: number;
  merchantId?: string | null;
  categoryId?: string | null;
  priority?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  isActive?: boolean;
}

export interface PaymentMethod {
  id: string;
  providerCode: string;
  methodCode: string;
  name: string;
  type: string;
  isActive: boolean;
  sortOrder: number | null;
}
