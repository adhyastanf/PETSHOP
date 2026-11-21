import { z } from 'zod';
import { nonNegativeNumberString, optionalNumberString, optionalString } from './validation';

export const commissionRuleFormSchema = z
  .object({
    transactionType: z.enum(['PRODUCT', 'SERVICE']),
    commissionType: z.enum(['PERCENTAGE', 'FIXED']),
    commissionValue: nonNegativeNumberString,
    priority: optionalNumberString,
    merchantId: optionalString,
    categoryId: optionalString,
    validFrom: optionalString,
    validUntil: optionalString,
  })
  // UX-only check; backend validation remains authoritative.
  .refine((d) => !d.validFrom || !d.validUntil || new Date(d.validUntil) > new Date(d.validFrom), {
    path: ['validUntil'],
    message: 'config.commission.invalidDateRange',
  });

export type CommissionRuleFormSchema = z.infer<typeof commissionRuleFormSchema>;

export const EMPTY_COMMISSION_RULE_FORM: CommissionRuleFormSchema = {
  transactionType: 'PRODUCT',
  commissionType: 'PERCENTAGE',
  commissionValue: '',
  priority: '0',
  merchantId: '',
  categoryId: '',
  validFrom: '',
  validUntil: '',
};
