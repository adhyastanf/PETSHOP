/**
 * Zod validation schemas for auth forms.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(150, 'Name must be 150 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be 255 characters or less'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be 72 characters or less'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm password is required'),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,30}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
