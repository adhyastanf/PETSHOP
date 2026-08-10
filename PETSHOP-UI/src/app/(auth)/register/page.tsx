'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { useRegister } from '@/hooks/use-auth';
import { RegisterSchema, registerSchema } from '@/lib/schema/auth-schema';
import { RegisterRequest } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending } = useRegister();
  const { handleSubmit, control, reset } = useForm<RegisterSchema>({
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

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault();
  //   setErrors({});

  //   const result = registerSchema.safeParse(formData);
  //   if (!result.success) {
  //     const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
  //     for (const issue of result.error.issues) {
  //       const field = issue.path[0] as keyof RegisterFormData;
  //       if (!fieldErrors[field]) {
  //         fieldErrors[field] = issue.message;
  //       }
  //     }
  //     setErrors(fieldErrors);
  //     return;
  //   }

  //   // Build request payload (exclude confirmPassword)
  //   const requestData = {
  //     fullName: result.data.fullName,
  //     email: result.data.email,
  //     password: result.data.password,
  //     phoneNumber: result.data.phoneNumber || undefined,
  //   };

  //   registerMutation.mutate(requestData, {
  //     onError: (error) => {
  //       if (error instanceof ApiError) {
  //         if (error.code === 'DUPLICATE_EMAIL') {
  //           setErrors((prev) => ({ ...prev, email: 'Email sudah terdaftar' }));
  //         } else if (error.code === 'DUPLICATE_PHONE') {
  //           setErrors((prev) => ({ ...prev, phoneNumber: 'Nomor telepon sudah terdaftar' }));
  //         } else {
  //           toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
  //         }
  //       } else {
  //         toast.error('Terjadi kesalahan jaringan. Silakan coba lagi.');
  //       }
  //     },
  //   });
  // }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Daftar Akun</CardTitle>
        <CardDescription>Buat akun baru untuk mulai berbelanja</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4' noValidate>
          {/* Full Name */}
          <Controller
            name='fullName'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='form-input-fullname'>Nama Lengkap</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} placeholder='Nama Lengkap' id='form-input-fullname' />
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
                <FieldLabel htmlFor='form-input-email'>Email</FieldLabel>
                <Input {...field} type='email' aria-invalid={fieldState.invalid} placeholder='nama@gmail.com' id='form-input-email' />
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
                <FieldLabel htmlFor='form-input-phonenumber'>Nomor Telepon</FieldLabel>
                <Input {...field} aria-invalid={fieldState.invalid} placeholder='+6281234567890' id='form-input-phonenumber' />
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
                <FieldLabel htmlFor='form-input-password'>Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput {...field} aria-invalid={fieldState.invalid} id='form-input-password' className='border-0 shadow-none focus-visible:ring-0' placeholder='Minimal 8 Karakter' type={showPassword ? 'text' : 'password'} />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
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
                <FieldLabel htmlFor='form-input-confirmPassword'>Konfirmasi Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id='form-input-confirmPassword'
                    className='border-0 shadow-none focus-visible:ring-0'
                    placeholder='Minimal 8 Karakter'
                    type={showConfirm ? 'text' : 'password'}
                  />
                  <InputGroupAddon align='inline-end'>
                    <InputGroupButton
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
            Daftar
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          Sudah punya akun?{' '}
          <Link href='/login' className='font-medium text-primary hover:underline'>
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
