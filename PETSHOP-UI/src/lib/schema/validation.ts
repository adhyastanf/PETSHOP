import { z } from 'zod';

/**
 * Shared Zod building blocks for forms.
 * Error messages are translation keys; render them with `FormFieldError`.
 */
export const MSG_REQUIRED = 'common.validation.required';
export const MSG_INVALID_NUMBER = 'common.validation.invalidNumber';
export const MSG_INVALID_EMAIL = 'common.validation.invalidEmail';
export const MSG_NOT_NEGATIVE = 'common.validation.notNegative';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const requiredString = z.string().trim().min(1, { message: MSG_REQUIRED });

export const optionalString = z.string();

export const requiredEmail = requiredString.refine((v) => EMAIL_PATTERN.test(v), { message: MSG_INVALID_EMAIL });

export const optionalEmail = z.string().refine((v) => v.trim() === '' || EMAIL_PATTERN.test(v.trim()), { message: MSG_INVALID_EMAIL });

export const nonNegativeNumberString = requiredString
  .refine((v) => !Number.isNaN(Number(v)), { message: MSG_INVALID_NUMBER })
  .refine((v) => Number.isNaN(Number(v)) || Number(v) >= 0, { message: MSG_NOT_NEGATIVE });

export const optionalNumberString = z.string().refine((v) => v.trim() === '' || !Number.isNaN(Number(v)), { message: MSG_INVALID_NUMBER });
