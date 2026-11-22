'use client';

import ApiErrorState from '@/components/Feedback/ApiErrorState';
import { FormDatePicker } from '@/components/Input/FormDatePicker';
import FormSelect from '@/components/Input/FormSelect';
import PetsModalFormSkeleton from '@/components/Loading/PetModalSkeleton';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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

  const { data: petDetail, isLoading: isPetDetailLoading, isError: isPetDetailError, refetch: retryPetDetail, isRefetching: isPetDetailRefetching } = usePet(petsId);
  const { data: petTypes, isLoading: isPetTypesLoading, isError: isPetTypesError, refetch: retryPetTypes, isRefetching: isPetTypesRefetching } = usePetTypes();
  const { mutate: createPet, isPending: isCreatePetLoading } = useCreatePet();
  const { mutate: updatePet, isPending: isUpdatePetLoading } = useUpdatePet();

  const activePetTypeId = useWatch({
    control,
    name: 'petTypeId',
  });

  const activedPetTypeId = activePetTypeId || '';

  const { data: breedsTypes, isLoading: isBreedsLoading, isError: isBreedsError, refetch: retryBreeds, isRefetching: isBreedsRefetching } = useBreeds(activedPetTypeId);

  const TITLE_TEXT = mode === 'edit' ? t('pet.form.editTitle') : t('pet.form.createTitle');
  const DESC_TEXT = mode === 'edit' ? t('pet.form.editDescription') : t('pet.form.createDescription');
  const SUBMIT_TEXT = mode === 'edit' ? t('pet.form.updateAction') : t('pet.form.createAction');
  const genderOptions = [
    { label: t('pet.form.male'), value: 'MALE' },
    { label: t('pet.form.female'), value: 'FEMALE' },
  ];

  const MAP_PETTYPES_OPTIONS = toSelectOptions(petTypes, 'name', 'id');
  const MAP_BREEDS_OPTIONS = toSelectOptions(breedsTypes, 'name', 'id');

  const IS_BREEDS_EMPTY = MAP_BREEDS_OPTIONS.length === 0;

  function onPetCreate(data: PetFormSchema) {
    if (isCreatePetLoading || isUpdatePetLoading) return;
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
      title: t('pet.form.confirmCreateTitle'),
      description: t('pet.form.confirmCreateDescription'),
      onConfirm: () => {
        createPet(payload, {
          onSuccess: () => {
            reset();
            onClose();
            alertDialog.success({
              title: t('pet.form.createdTitle'),
              description: t('pet.form.createdDescription'),
            });
          },
        });
      },
    });
  }

  function onPetUpdate(data: PetFormSchema) {
    if (isCreatePetLoading || isUpdatePetLoading) return;
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
      title: t('pet.form.confirmUpdateTitle'),
      description: t('pet.form.confirmUpdateDescription'),
      onConfirm: () => {
        updatePet(
          { id: petsId, data: payload },
          {
            onSuccess: () => {
              reset();
              onClose();
              alertDialog.success({
                title: t('pet.form.updatedTitle'),
                description: t('pet.form.updatedDescription'),
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

      {mode === 'edit' && isPetDetailError ? <ApiErrorState onRetry={() => void retryPetDetail()} isRetrying={isPetDetailRefetching} /> : null}
      {isPetTypesError ? <ApiErrorState onRetry={() => void retryPetTypes()} isRetrying={isPetTypesRefetching} /> : null}
      {isBreedsError ? <ApiErrorState onRetry={() => void retryBreeds()} isRetrying={isBreedsRefetching} /> : null}
      {!isPetDetailLoading && !isPetDetailError && !isPetTypesError && !isBreedsError && (
        <form onSubmit={mode === 'edit' ? handleSubmit(onPetUpdate) : handleSubmit(onPetCreate)} className='flex flex-col gap-4'>
          <FieldGroup>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Controller
                name='name'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.name')}
                    </FieldLabel>
                    <Input id={field.name} {...field} placeholder={t('pet.form.namePlaceholder')} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='petTypeId'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.petType')}
                    </FieldLabel>
                    <FormSelect
                      id={field.name}
                      value={field.value}
                      onValueChange={(value) => {
                        handleChangePetType(value || '', field.onChange);
                      }}
                      items={MAP_PETTYPES_OPTIONS}
                      placeholder={t('pet.form.selectType')}
                      invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor={field.name}>{t('pet.form.breed')}</FieldLabel>
                    <FormSelect
                      id={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      items={MAP_BREEDS_OPTIONS || []}
                      placeholder={t('pet.form.selectBreed')}
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
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.gender')}
                    </FieldLabel>
                    <FormSelect
                      id={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      items={genderOptions}
                      placeholder={t('pet.form.selectGender')}
                      invalid={fieldState.invalid}
                      disabled={isPetTypesLoading}
                      isLoading={isPetTypesLoading}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='birthDate'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.birthDate')}
                    </FieldLabel>
                    <FormDatePicker id={field.name} field={field} invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='weightKg'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.weight')}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      maxLength={3}
                      placeholder={t('pet.form.weightPlaceholder')}
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
                    <FieldLabel htmlFor={field.name} required>
                      {t('pet.form.color')}
                    </FieldLabel>
                    <Input id={field.name} {...field} placeholder={t('pet.form.colorPlaceholder')} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='microchipNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t('pet.form.microchipNumber')}</FieldLabel>
                    <Input id={field.name} {...field} placeholder={t('pet.form.microchipPlaceholder')} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='allergies'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className='col-span-1 md:col-span-2'>
                    <FieldLabel htmlFor={field.name}>{t('pet.form.allergies')}</FieldLabel>
                    <Textarea id={field.name} {...field} placeholder={t('pet.form.allergiesPlaceholder')} className='resize-none' aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name='specialNotes'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className='col-span-1 md:col-span-2'>
                    <FieldLabel htmlFor={field.name}>{t('pet.form.specialNotes')}</FieldLabel>
                    <Textarea id={field.name} {...field} placeholder={t('pet.form.notesPlaceholder')} className='resize-none' aria-invalid={fieldState.invalid} />
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
          </FieldGroup>

          <Button type='submit' className='mt-2 w-full rounded-xl py-5' loading={isCreatePetLoading || isUpdatePetLoading} disabled={isCreatePetLoading || isUpdatePetLoading}>
            <Save className='size-4' />
            {SUBMIT_TEXT}
          </Button>
        </form>
      )}
    </Modal>
  );
}

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
