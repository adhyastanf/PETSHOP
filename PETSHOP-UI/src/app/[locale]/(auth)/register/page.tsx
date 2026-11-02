'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { useRegister } from '@/hooks/use-auth';
import { RegisterSchema, registerSchema } from '@/lib/schema/auth-schema';
import { RegisterRequest } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Menggunakan satu fungsi t global tanpa namespace spesifik
  const t = useTranslations();

  const { mutate, isPending } = useRegister();
  const { handleSubmit, control } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  });

  async function onSubmit(values: RegisterRequest) {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber || undefined,
    };

    mutate(payload);
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>{t('auth.register.title')}</CardTitle>
        <CardDescription>{t('auth.register.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
          {/* Full Name */}
          <Controller
            name='fullName'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-fullname'>{t('auth.register.fullName')}</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} placeholder={t('auth.register.fullNamePlaceholder')} id='form-input-fullname' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-email'>{t('auth.register.email')}</FieldLabel>
                <Input {...field} type='email' aria-invalid={fieldState.invalid} placeholder={t('auth.register.emailPlaceholder')} id='form-input-email' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Phone (optional) */}
          <Controller
            name='phoneNumber'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-phonenumber'>{t('auth.register.phone')}</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} placeholder={t('auth.register.phonePlaceholder')} id='form-input-phonenumber' />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-password'>{t('auth.register.password')}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id='form-input-password'
                    className='border-0 shadow-none focus-visible:ring-0'
                    placeholder={t('auth.register.passwordPlaceholder')}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      type='button'
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <EyeOffIcon className='size-4 text-muted-foreground' /> : <EyeIcon className='size-4 text-muted-foreground' />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          {/* Confirm Password */}
          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-confirmPassword'>{t('auth.register.confirmPassword')}</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id='form-input-confirmPassword'
                    className='border-0 shadow-none focus-visible:ring-0'
                    placeholder={t('auth.register.confirmPasswordPlaceholder')}
                    type={showConfirm ? 'text' : 'password'}
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
                      type='button'
                      onClick={() => {
                        setShowConfirm(!showConfirm);
                      }}
                    >
                      {showConfirm ? <EyeOffIcon className='size-4 text-muted-foreground' /> : <EyeIcon className='size-4 text-muted-foreground' />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type='submit' className='w-full' size='lg' loading={isPending}>
            {t('auth.register.submit')}
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {t('auth.register.hasAccount')}{' '}
          <Link href='/login' className='font-medium text-primary hover:underline'>
            {t('auth.login.title')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
