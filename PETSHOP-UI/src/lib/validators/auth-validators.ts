/**
 * Zod validation schemas for auth forms.
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Nama lengkap wajib diisi')
    .max(150, 'Nama maksimal 150 karakter'),
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter'),
  confirmPassword: z
    .string()
    .min(1, 'Konfirmasi password wajib diisi'),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,30}$/, 'Format nomor telepon tidak valid')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak sama',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
