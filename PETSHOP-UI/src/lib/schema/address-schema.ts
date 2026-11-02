import { z } from 'zod';

export const addressFormSchema = z.object({
  label: z.string().optional(),
  recipientName: z.string().min(1, 'Nama penerima wajib diisi'),
  recipientPhone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  provinceCode: z.string().optional(),
  provinceName: z.string().optional(),
  cityCode: z.string().optional(),
  cityName: z.string().optional(),
  districtCode: z.string().optional(),
  districtName: z.string().optional(),
  subdistrictCode: z.string().optional(),
  subdistrictName: z.string().optional(),
  postalCode: z.string().min(5, 'Kode pos tidak valid'),
  addressLine: z.string().min(5, 'Alamat lengkap wajib diisi'),
  latitude: z.string().nullable().optional(),
  longitude: z.string().nullable().optional(),
  notes: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormSchema = z.infer<typeof addressFormSchema>;
