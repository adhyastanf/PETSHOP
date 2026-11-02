'use client';

import { FormDatePicker } from '@/components/Input/FormDatePicker';
import FormSelect from '@/components/Input/FormSelect';
import PetsModalFormSkeleton from '@/components/Loading/PetModalSkeleton';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBreeds, useCreatePet, usePet, usePetTypes, useUpdatePet } from '@/hooks/use-customer';
import { alertDialog } from '@/lib/alert-dialog';
import { PetFormSchema, petFormSchema } from '@/lib/schema/pet-schema';
import { usePetsStore } from '@/store/pets-store';
import { PetRequest } from '@/types/address-types';
import { onlyNumbers, toSelectOptions } from '@/utils/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

type PetsModalFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: PetRequest) => void;
};

export default function PetsModalForm({ open = false, onClose = () => {} }: PetsModalFormProps) {
  const t = useTranslations();
  const { mode, petsId } = usePetsStore((state) => state);
  const { handleSubmit, control, reset, setValue, setValues } = useForm<PetFormSchema>({
    resolver: zodResolver(petFormSchema),
    defaultValues: EMPTY_PET_FORM,
  });

  const { data: petDetail, isLoading: isPetDetailLoading } = usePet(petsId);
  const { data: petTypes, isLoading: isPetTypesLoading } = usePetTypes();
  const { mutate: createPet, isPending: isCreatePetLoading } = useCreatePet();
  const { mutate: updatePet, isPending: isUpdatePetLoading } = useUpdatePet();

  const activePetTypeId = useWatch({
    control,
    name: 'petTypeId',
  });

  const activedPetTypeId = activePetTypeId || '';

  const { data: breedsTypes, isLoading: isBreedsLoading } = useBreeds(activedPetTypeId);

  const TITLE_TEXT = mode === 'edit' ? 'Edit Profil Anabul' : 'Tambah Profil Anabul';
  const DESC_TEXT = mode === 'edit' ? 'Perbarui detail profil anabul Anda.' : 'Lengkapi profil anabul Anda.';
  const SUBMIT_TEXT = mode === 'edit' ? 'Perbarui Profil' : 'Tambah Profil';

  const MAP_PETTYPES_OPTIONS = toSelectOptions(petTypes, 'name', 'id');
  const MAP_BREEDS_OPTIONS = toSelectOptions(breedsTypes, 'name', 'id');

  const IS_BREEDS_EMPTY = MAP_BREEDS_OPTIONS.length === 0;

  function onPetCreate(data: PetFormSchema) {
    const payload: PetRequest = {
      name: data.name,
      petTypeId: data.petTypeId,
      breedId: data.breedId || null,
      gender: data.gender,
      birthDate: format(data.birthDate, 'yyyy-MM-dd'),
      birthDateEstimated: data.birthDateEstimated,
      weightKg: Number(data.weightKg),
      color: data.color,
      sterilized: data.sterilized,
      microchipNumber: data.microchipNumber,
      profileImageFileId: data.profileImageFileId || null,
      allergies: data.allergies,
      specialNotes: data.specialNotes,
    };

    alertDialog.confirm({
      title: 'Tambah Anabul',
      description: 'Apakah Anda yakin ingin menambahkan anabul ini?',
      onConfirm: () => {
        createPet(payload, {
          onSuccess: () => {
            reset();
            onClose();
            alertDialog.success({
              title: 'Anabul berhasil ditambahkan',
              description: 'Profil anabul baru telah ditambahkan ke daftar Anda.',
            });
          },
        });
      },
    });
  }

  function onPetUpdate(data: PetFormSchema) {
    const payload: PetRequest = {
      name: data.name,
      petTypeId: data.petTypeId,
      breedId: data.breedId || null,
      gender: data.gender,
      birthDate: format(data.birthDate, 'yyyy-MM-dd'),
      birthDateEstimated: data.birthDateEstimated,
      weightKg: Number(data.weightKg),
      color: data.color,
      sterilized: data.sterilized,
      microchipNumber: data.microchipNumber,
      profileImageFileId: data.profileImageFileId || null,
      allergies: data.allergies,
      specialNotes: data.specialNotes,
    };

    alertDialog.confirm({
      title: 'Perbarui Anabul',
      description: 'Apakah Anda yakin ingin memperbarui anabul ini?',
      onConfirm: () => {
        updatePet(
          { id: petsId, data: payload },
          {
            onSuccess: () => {
              reset();
              onClose();
              alertDialog.success({
                title: 'Anabul berhasil diperbarui',
                description: 'Profil anabul telah diperbarui.',
              });
            },
          },
        );
      },
    });
  }

  function handleChangePetType(value: string, onChange: (value: string | null) => void) {
    onChange(value);
    if (value !== activePetTypeId) {
      setValue('breedId', '');
    }
  }

  useEffect(() => {
    if (mode === 'create') {
      reset(EMPTY_PET_FORM);
    }
  }, [mode, reset]);

  useEffect(() => {
    if (!petDetail || mode !== 'edit') return;

    setValues({
      name: petDetail.name ?? '',
      petTypeId: petDetail.petTypeId ?? '',
      breedId: petDetail.breedId ?? '',
      gender: petDetail.gender ?? 'MALE',
      birthDate: petDetail.birthDate ? new Date(petDetail.birthDate) : new Date(),
      weightKg: String(petDetail.weightKg) ?? '',
      color: petDetail.color ?? '',
      birthDateEstimated: petDetail.birthDateEstimated ?? false,
      sterilized: petDetail.sterilized ?? false,
      microchipNumber: petDetail.microchipNumber ?? '',
      allergies: petDetail.allergies ?? '',
      specialNotes: petDetail.specialNotes ?? '',
    });
  }, [mode, petDetail, setValues]);

  return (
    <Modal open={open} onClose={onClose} title={TITLE_TEXT} description={DESC_TEXT} maxWidth='sm:max-w-[700px]'>
      {isPetDetailLoading && <PetsModalFormSkeleton />}

      {!isPetDetailLoading && (
        <form onSubmit={mode === 'edit' ? handleSubmit(onPetUpdate) : handleSubmit(onPetCreate)} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              name='name'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.name')}</FieldLabel>
                  <Input {...field} placeholder='Nama anabul' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='petTypeId'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.petType')}</FieldLabel>
                  <FormSelect
                    value={field.value}
                    onValueChange={(value) => {
                      handleChangePetType(value || '', field.onChange);
                    }}
                    items={MAP_PETTYPES_OPTIONS}
                    placeholder='Pilih jenis anabul'
                    invalid={fieldState.invalid}
                    disabled={!true}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='breedId'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t('pet.form.breed')}</FieldLabel>
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    items={MAP_BREEDS_OPTIONS || []}
                    placeholder='Pilih jenis anabul'
                    invalid={fieldState.invalid}
                    disabled={isBreedsLoading || IS_BREEDS_EMPTY}
                    isLoading={isBreedsLoading}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='gender'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.gender')}</FieldLabel>
                  <FormSelect value={field.value} onValueChange={field.onChange} items={GENDER_OPTIONS || []} placeholder='Pilih jenis anabul' invalid={fieldState.invalid} disabled={isPetTypesLoading} isLoading={isPetTypesLoading} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='birthDate'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.birthDate')}</FieldLabel>
                  <FormDatePicker field={field} invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='weightKg'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.weight')}</FieldLabel>
                  <Input
                    {...field}
                    maxLength={3}
                    placeholder='0.00'
                    onChange={(e) => {
                      field.onChange(onlyNumbers(e.target.value));
                    }}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='color'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>{t('pet.form.color')}</FieldLabel>
                  <Input {...field} placeholder='Contoh: Hitam putih' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='microchipNumber'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>{t('pet.form.microchipNumber')}</FieldLabel>
                  <Input {...field} placeholder='Nomor microchip' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='allergies'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='col-span-1 md:col-span-2'>
                  <FieldLabel>{t('pet.form.allergies')}</FieldLabel>
                  <Textarea {...field} placeholder='Contoh: Tidak cocok dengan ayam...' className='resize-none' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='specialNotes'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='col-span-1 md:col-span-2'>
                  <FieldLabel>{t('pet.form.specialNotes')}</FieldLabel>
                  <Textarea {...field} placeholder='Catatan khusus untuk anabul' className='resize-none' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='birthDateEstimated'
              control={control}
              render={({ field, fieldState }) => (
                <Field orientation='horizontal' data-invalid={fieldState.invalid} className='flex items-center gap-2'>
                  <Checkbox id='birth-date-estimated' checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                  <FieldLabel htmlFor='birth-date-estimated' className='cursor-pointer font-normal'>
                    {t('pet.form.birthDateEstimated')}
                  </FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='sterilized'
              control={control}
              render={({ field, fieldState }) => (
                <Field orientation='horizontal' data-invalid={fieldState.invalid} className='flex items-center gap-2'>
                  <Checkbox id='sterilized' checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
                  <FieldLabel htmlFor='sterilized' className='cursor-pointer font-normal'>
                    {t('pet.form.sterilized')}
                  </FieldLabel>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <Button type='submit' className='mt-2 w-full rounded-xl py-5' loading={isCreatePetLoading || isUpdatePetLoading} disabled={isCreatePetLoading || isUpdatePetLoading}>
            <Save className='size-4' />
            {SUBMIT_TEXT}
          </Button>
        </form>
      )}
    </Modal>
  );
}

const GENDER_OPTIONS = [
  { label: 'Jantan', value: 'MALE' },
  { label: 'Betina', value: 'FEMALE' },
];

const EMPTY_PET_FORM = {
  name: '',
  petTypeId: '',
  breedId: '',
  gender: '',
  birthDate: new Date(),
  weightKg: '',
  color: '',
  birthDateEstimated: false,
  sterilized: false,
  hasMicrochip: false,
  microchipNumber: '',
  allergies: '',
  specialNotes: '',
  profileImageFileId: null,
};
