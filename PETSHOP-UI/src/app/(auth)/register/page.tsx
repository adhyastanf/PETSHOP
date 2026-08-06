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
import { useI18n } from '@/lib/i18n';

export default function RegisterPage() {
  const { t } = useI18n();
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
            setErrors((prev) => ({ ...prev, email: t('auth.register.duplicateEmail') }));
          } else if (error.code === 'DUPLICATE_PHONE') {
            setErrors((prev) => ({ ...prev, phoneNumber: t('auth.register.duplicatePhone') }));
          } else {
            toast.error(error.message || t('auth.register.failed'));
          }
        } else {
          toast.error(t('common.networkError'));
        }
      },
    });
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>{t('auth.register.title')}</CardTitle>
        <CardDescription>{t('auth.register.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          {/* Full Name */}
          <div className='space-y-2'>
            <Label htmlFor='fullName'>{t('auth.register.fullName')}</Label>
            <Input
              id='fullName'
              type='text'
              placeholder={t('auth.register.fullNamePlaceholder')}
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
            <Label htmlFor='email'>{t('auth.register.email')}</Label>
            <Input
              id='email'
              type='email'
              placeholder={t('auth.register.emailPlaceholder')}
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
              {t('auth.register.phone')} <span className='text-muted-foreground font-normal'>{t('auth.register.optional')}</span>
            </Label>
            <Input
              id='phoneNumber'
              type='tel'
              placeholder={t('auth.register.phonePlaceholder')}
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
            <Label htmlFor='password'>{t('auth.register.password')}</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.register.passwordPlaceholder')}
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
                aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
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
            <Label htmlFor='confirmPassword'>{t('auth.register.confirmPassword')}</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
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
                aria-label={showConfirm ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
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
            {t('auth.register.submit')}
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {t('auth.register.hasAccount')}{' '}
          <Link href='/login' className='font-medium text-primary hover:underline'>
            {t('common.signIn')}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
