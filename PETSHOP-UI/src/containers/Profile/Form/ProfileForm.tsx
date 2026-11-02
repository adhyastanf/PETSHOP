'use client';

import { FormDatePicker } from '@/components/Input/FormDatePicker';
import FormSelect from '@/components/Input/FormSelect';
import FormProfileSkeleton from '@/components/Loading/ProfileSkeleton';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCustomerProfile, useUpdateCustomerProfile } from '@/hooks/use-customer';
import { UserSettingsSchema, userSettingsSchema } from '@/lib/schema/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { Pen, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function FormProfile() {
  const [mode, setMode] = useState<'created' | 'edit'>('created');
  const { mutate: updateProfile, isPending: isLoadingSubmitProfile } = useUpdateCustomerProfile();
  const { data: users, isLoading: isLoadingProfile } = useCustomerProfile();
  const t = useTranslations();
  
  const {
    handleSubmit: handleProfileSubmit,
    control: profileControl,
    setValues,
  } = useForm<UserSettingsSchema>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: EMPTY_PROFILE,
  });

  const isEditMode = mode === 'edit';

  function handleSubmit(data: UserSettingsSchema) {
    const payload = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      profileImageFileId: null,
      gender: data.gender,
      birthDate: format(data.birthDate, 'yyyy-MM-dd'),
    };

    updateProfile(payload, {
      onSuccess: () => {
        setMode('created');
      },
    });
  }

  const GENDER_OPTIONS = [
    {
      label: t('pet.form.male'),
      value: t('pet.form.male'),
    },
    {
      label: t('pet.form.female'),
      value: t('pet.form.female'),
    },
  ];

  useEffect(() => {
    if (!users) return;

    setValues({
      fullName: users.fullName,
      gender: users.gender ?? '',
      phoneNumber: users.phoneNumber ?? '',
      birthDate: parse(users.birthDate ?? '', 'yyyy-MM-dd', new Date()),
    });
  }, [users, setValues]);

  if (isLoadingProfile) {
    return <FormProfileSkeleton />;
  }

  return (
    <form onSubmit={handleProfileSubmit(handleSubmit)} className='space-y-8'>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Controller
            name='fullName'
            control={profileControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-fullname'>{t('auth.register.fullName')}</FieldLabel>
                <Input {...field} disabled={!isEditMode} aria-invalid={fieldState.invalid} id='form-input-fullname' placeholder={t('auth.register.fullName')} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='phoneNumber'
            control={profileControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-phone'>{t('address.form.phone')}</FieldLabel>
                <Input
                  {...field}
                  disabled={!isEditMode}
                  aria-invalid={fieldState.invalid}
                  pattern='[0-9]*'
                  inputMode='numeric'
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    field.onChange(value);
                  }}
                  id='form-input-phone'
                  placeholder={t('auth.register.phonePlaceholder')}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='gender'
            control={profileControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-select-gender'>{t('pet.form.gender')}</FieldLabel>
                <FormSelect value={field.value} onValueChange={field.onChange} items={GENDER_OPTIONS} placeholder='Select gender' invalid={fieldState.invalid} disabled={!isEditMode} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name='birthDate'
            control={profileControl}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-birthdate'>{t('pet.form.birthDate')}</FieldLabel>
                <FormDatePicker field={field} invalid={fieldState.invalid} disabled={!isEditMode} />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
      </FieldGroup>

      <div className='flex justify-end gap-2'>
        {isEditMode ? (
          <>
            <Button className='px-3 h-9' variant='outline' onClick={() => setMode('created')}>
              Batal
            </Button>
            <Button type='submit' className='px-3 h-9' loading={isLoadingSubmitProfile}>
              <Save className='size-4 mr-1' />
              {t('common.save')}
            </Button>
          </>
        ) : (
          <Button className='px-3 h-9' onClick={() => setMode('edit')}>
            <Pen className='size-4 mr-1' />
            Ubah
          </Button>
        )}
      </div>
    </form>
  );
}

const EMPTY_PROFILE = {
  fullName: '',
  phoneNumber: '',
  gender: '',
  birthDate: new Date(),
};
