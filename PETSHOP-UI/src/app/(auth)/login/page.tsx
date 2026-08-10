'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { useLogin } from '@/hooks/use-auth';
import { loginSchema, LoginSchema } from '@/lib/schema/auth-schema';
import { LoginRequest } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { handleSubmit, control, reset } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending: isLoadingLogin } = useLogin();

  function onSubmit(values: LoginRequest) {
    mutate(values);
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Masuk</CardTitle>
        <CardDescription>Masukkan email dan password untuk masuk ke akun Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form className='space-y-4' onSubmit={handleSubmit(onSubmit)} id='form-login'>
          <FieldGroup>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-input-email'>Email</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} placeholder='Email' id='form-input-email' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-input-password'>Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput {...field} aria-invalid={fieldState.invalid} id='form-input-password' className='border-0 shadow-none focus-visible:ring-0' placeholder='Password' type={showPassword ? 'text' : 'password'} />
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
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='vertical'>
          <Button type='submit' form='form-login' className='w-full' size='lg' loading={isLoadingLogin}>
            Masuk
          </Button>
          <p className='mt-4 text-center text-sm text-muted-foreground'>
            Belum punya akun?{' '}
            <Link href='/register' className='font-medium text-primary hover:underline'>
              Daftar
            </Link>
          </p>
        </Field>
      </CardFooter>
    </Card>
  );
}
