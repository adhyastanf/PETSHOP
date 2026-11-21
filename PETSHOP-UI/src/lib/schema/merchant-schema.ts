import { z } from 'zod';
import { optionalEmail, optionalString, requiredEmail, requiredString } from './validation';

// ----- Customer: merchant application -----
export const merchantApplySchema = z.object({
  businessName: requiredString,
  displayName: optionalString,
  description: optionalString,
  email: optionalEmail,
  phoneNumber: optionalString,
  whatsappNumber: optionalString,
  nib: optionalString,
  npwp: optionalString,
});

export type MerchantApplySchema = z.infer<typeof merchantApplySchema>;

export const EMPTY_MERCHANT_APPLY: MerchantApplySchema = {
  businessName: '',
  displayName: '',
  description: '',
  email: '',
  phoneNumber: '',
  whatsappNumber: '',
  nib: '',
  npwp: '',
};

// ----- Mitra: merchant profile -----
export const merchantProfileSchema = z.object({
  displayName: optionalString,
  description: optionalString,
  email: optionalEmail,
  phoneNumber: optionalString,
  whatsappNumber: optionalString,
});

export type MerchantProfileSchema = z.infer<typeof merchantProfileSchema>;

export const EMPTY_MERCHANT_PROFILE: MerchantProfileSchema = {
  displayName: '',
  description: '',
  email: '',
  phoneNumber: '',
  whatsappNumber: '',
};

// ----- Mitra: branch (create / setup / edit) -----
export const branchFormSchema = z.object({
  name: requiredString,
  phoneNumber: optionalString,
  email: optionalEmail,
  provinceName: optionalString,
  cityName: optionalString,
  districtName: optionalString,
  postalCode: optionalString,
  addressLine: optionalString,
  isActive: z.boolean(),
});

export type BranchFormSchema = z.infer<typeof branchFormSchema>;

export const EMPTY_BRANCH_FORM: BranchFormSchema = {
  name: '',
  phoneNumber: '',
  email: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  postalCode: '',
  addressLine: '',
  isActive: true,
};

// ----- Mitra: branch operating hours -----
export const branchHoursSchema = z.object({
  hours: z.array(
    z
      .object({
        dayOfWeek: z.number(),
        openTime: z.string().nullable(),
        closeTime: z.string().nullable(),
        isClosed: z.boolean(),
      })
      // Open days need both times (UX-only; backend is authoritative).
      .refine((d) => d.isClosed || (!!d.openTime && !!d.closeTime), {
        path: ['openTime'],
        message: 'common.validation.required',
      }),
  ),
});

export type BranchHoursSchema = z.infer<typeof branchHoursSchema>;

// ----- Mitra: staff -----
export const staffFormSchema = z.object({
  email: requiredEmail,
  roleCode: requiredString,
  employeeCode: optionalString,
  displayName: optionalString,
});

export type StaffFormSchema = z.infer<typeof staffFormSchema>;

export const EMPTY_STAFF_FORM: StaffFormSchema = {
  email: '',
  roleCode: '',
  employeeCode: '',
  displayName: '',
};

// ----- Admin: verification -----
export const merchantVerificationSchema = z.object({
  // '' means "not selected yet"; the backend validates the allowed decision values.
  decision: z.string().min(1, { message: 'merchant.verification.decisionRequired' }),
  notes: optionalString,
});

export type MerchantVerificationSchema = z.infer<typeof merchantVerificationSchema>;

export const vetVerificationSchema = z.object({
  notes: optionalString,
});

export type VetVerificationSchema = z.infer<typeof vetVerificationSchema>;
