'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useRegister } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormData } from '@/lib/validators/auth-validators';
import { ApiError } from '@/lib/api-client';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const registerMutation = useRegister();

  function handleChange(field: keyof RegisterFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Build request payload (exclude confirmPassword)
    const { confirmPassword: _, ...payload } = result.data;
    const requestData = {
      ...payload,
      phoneNumber: payload.phoneNumber || undefined,
    };

    registerMutation.mutate(requestData, {
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.code === 'DUPLICATE_EMAIL') {
            setErrors((prev) => ({ ...prev, email: 'Email sudah terdaftar' }));
          } else if (error.code === 'DUPLICATE_PHONE') {
            setErrors((prev) => ({ ...prev, phoneNumber: 'Nomor telepon sudah terdaftar' }));
          } else {
            toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
          }
        } else {
          toast.error('Terjadi kesalahan jaringan. Silakan coba lagi.');
        }
      },
    });
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Daftar Akun</CardTitle>
        <CardDescription>Buat akun baru untuk mulai berbelanja</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          {/* Full Name */}
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Nama Lengkap</Label>
            <Input
              id='fullName'
              type='text'
              placeholder='Nama lengkap Anda'
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              autoComplete='name'
              disabled={registerMutation.isPending}
            />
            {errors.fullName && (
              <p id='fullName-error' className='text-xs text-destructive'>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='nama@email.com'
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete='email'
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p id='email-error' className='text-xs text-destructive'>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone (optional) */}
          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>
              Nomor Telepon <span className='text-muted-foreground font-normal'>(opsional)</span>
            </Label>
            <Input
              id='phoneNumber'
              type='tel'
              placeholder='+6281234567890'
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
              autoComplete='tel'
              disabled={registerMutation.isPending}
            />
            {errors.phoneNumber && (
              <p id='phoneNumber-error' className='text-xs text-destructive'>
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Minimal 8 karakter'
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                autoComplete='new-password'
                disabled={registerMutation.isPending}
              />
              <button
                type='button'
                className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
            {errors.password && (
              <p id='password-error' className='text-xs text-destructive'>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Konfirmasi Password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                placeholder='Ulangi password'
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                autoComplete='new-password'
                disabled={registerMutation.isPending}
              />
              <button
                type='button'
                className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showConfirm ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id='confirmPassword-error' className='text-xs text-destructive'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            loading={registerMutation.isPending}
          >
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
