import { z } from 'zod';

export const petFormSchema = z.object({
  name: z.string().min(1, 'Nama anabul wajib diisi'),
  petTypeId: z.string().min(1, 'Jenis anabul wajib dipilih'),
  breedId: z.string(),
  gender: z.string().min(1, 'Jenis kelamin anabul wajib dipilih'),
  birthDate: z.date({
    message: 'Tanggal lahir wajib diisi',
  }),
  weightKg: z.string().min(1, 'Berat anabul wajib diisi'),
  color: z.string().min(1, 'Warna wajib diisi'),
  birthDateEstimated: z.boolean(),
  sterilized: z.boolean(),
  hasMicrochip: z.boolean(),
  microchipNumber: z.string(),
  allergies: z.string(),
  specialNotes: z.string(),
  profileImageFileId: z.string().nullable(),
});

export type PetFormSchema = z.infer<typeof petFormSchema>;
