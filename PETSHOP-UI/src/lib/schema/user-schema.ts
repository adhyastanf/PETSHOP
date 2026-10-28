import z from 'zod';

export const userSettingsSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi').min(3, 'Nama lengkap minimal 3 karakter'),
  phoneNumber: z
    .string()
    .min(1, 'Nomor telepon wajib diisi')
    .regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka'),
  gender: z.string().min(1, 'Jenis kelamin wajib dipilih'),

  birthDate: z.date({
    message: 'Tanggal lahir wajib diisi',
  }),
});

export type UserSettingsSchema = z.infer<typeof userSettingsSchema>;
