'use client';

import ApiErrorState from '@/components/Feedback/ApiErrorState';
import { FormDatePicker } from '@/components/Input/FormDatePicker';
import FormSelect from '@/components/Input/FormSelect';
import FormProfileSkeleton from '@/components/Loading/ProfileSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCustomerProfile, useUpdateCustomerProfile } from '@/hooks/use-customer';
import { UserSettingsSchema, userSettingsSchema } from '@/lib/schema/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse } from 'date-fns';
import { Pen, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function FormProfile() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const { mutate: updateProfile, isPending: isLoadingSubmitProfile } = useUpdateCustomerProfile();
  const { data: users, isLoading: isLoadingProfile, isError, refetch, isRefetching } = useCustomerProfile();
  const t = useTranslations();
  const {
    handleSubmit: handleProfileSubmit,
    control: profileControl,
    reset,
  } = useForm<UserSettingsSchema>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: EMPTY_PROFILE,
  });

  const isEditMode = mode === 'edit';
  const genderOptions = [
    { label: t('pet.form.male'), value: 'MALE' },
    { label: t('pet.form.female'), value: 'FEMALE' },
  ];

  useEffect(() => {
    if (!users) return;
    reset({
      fullName: users.fullName,
      gender: users.gender ?? '',
      phoneNumber: users.phoneNumber ?? '',
      birthDate: users.birthDate ? parse(users.birthDate, 'yyyy-MM-dd', new Date()) : new Date(),
    });
  }, [users, reset]);

  if (isLoadingProfile) return <FormProfileSkeleton />;
  if (isError || !users) return <ApiErrorState onRetry={() => void refetch()} isRetrying={isRefetching} />;

  function handleSave(data: UserSettingsSchema) {
    if (isLoadingSubmitProfile) return;
    updateProfile(
      {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        birthDate: format(data.birthDate, 'yyyy-MM-dd'),
      },
      { onSuccess: () => setMode('view') },
    );
  }

  function cancelEditing() {
    setMode('view');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customer.profile.detailsHeading')}</CardTitle>
        <CardDescription>{isEditMode ? t('customer.profile.editDescription') : t('customer.profile.readOnlyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit(handleSave)} className='flex flex-col gap-6'>
          <FieldGroup>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
              <Controller
                name='fullName'
                control={profileControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-input-fullname' required>
                      {t('auth.register.fullName')}
                    </FieldLabel>
                    <Input {...field} id='form-input-fullname' disabled={!isEditMode} placeholder={t('auth.register.fullName')} aria-invalid={fieldState.invalid} />
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
                      id='form-input-phone'
                      disabled={!isEditMode}
                      placeholder={t('auth.register.phonePlaceholder')}
                      inputMode='numeric'
                      onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ''))}
                      aria-invalid={fieldState.invalid}
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
                    <FormSelect id='form-select-gender' value={field.value} onValueChange={field.onChange} items={genderOptions} placeholder={t('pet.form.selectGender')} invalid={fieldState.invalid} disabled={!isEditMode} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='birthDate'
                control={profileControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>{t('pet.form.birthDate')}</FieldLabel>
                    <FormDatePicker id={field.name} field={field} invalid={fieldState.invalid} disabled={!isEditMode} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
            {isEditMode ? (
              <>
                <Button type='button' variant='outline' onClick={cancelEditing} disabled={isLoadingSubmitProfile}>
                  {t('common.cancel')}
                </Button>
                <Button type='submit' disabled={isLoadingSubmitProfile}>
                  {isLoadingSubmitProfile ? <Spinner data-icon='inline-start' aria-hidden='true' /> : <Save data-icon='inline-start' aria-hidden='true' />}
                  {t('common.save')}
                </Button>
              </>
            ) : (
              <Button type='button' onClick={() => setMode('edit')}>
                <Pen data-icon='inline-start' aria-hidden='true' />
                {t('common.edit')}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const EMPTY_PROFILE: UserSettingsSchema = {
  fullName: '',
  phoneNumber: '',
  gender: '',
  birthDate: new Date(),
};
