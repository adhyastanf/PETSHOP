'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useLogin } from '@/hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/lib/validators/auth-validators';
import { ApiError } from '@/lib/api-client';

/**
 * Signal browser credential manager to save password.
 * Uses PasswordCredential API where available, falls back to hidden iframe submit.
 */
function signalCredentialSave(email: string, password: string) {
  if (typeof window === 'undefined') return;

  // Try PasswordCredential API (Chrome, Edge)
  if ('PasswordCredential' in window) {
    try {
      const cred = new (window as any).PasswordCredential({
        id: email,
        password: password,
      });
      navigator.credentials.store(cred).catch(() => {});
    } catch {
      // Fallback below
    }
    return;
  }

  // Fallback: submit a hidden form to a blank iframe to trigger save prompt
  try {
    const iframeName = '__cred_save_' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/login'; // same-origin path
    form.target = iframeName;
    form.style.display = 'none';

    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'email';
    emailInput.autocomplete = 'username';
    emailInput.value = email;
    form.appendChild(emailInput);

    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.name = 'password';
    passInput.autocomplete = 'current-password';
    passInput.value = password;
    form.appendChild(passInput);

    document.body.appendChild(form);
    form.submit();

    // Cleanup after short delay
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 2000);
  } catch {
    // Silent fail
  }
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(formData.password);
  passwordRef.current = formData.password;

  const loginMutation = useLogin();

  function handleChange(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    loginMutation.mutate(result.data, {
      onSuccess: () => {
        // Signal browser to save credentials after successful login
        signalCredentialSave(formData.email, passwordRef.current);
      },
      onError: (error) => {
        if (error instanceof ApiError) {
          if (error.status === 401 || error.code === 'INVALID_CREDENTIALS') {
            toast.error('Email atau password salah');
          } else if (error.code === 'ACCOUNT_BLOCKED') {
            toast.error('Akun Anda diblokir. Hubungi dukungan.');
          } else if (error.code === 'ACCOUNT_INACTIVE') {
            toast.error('Akun Anda tidak aktif.');
          } else if (error.code === 'ACCOUNT_SUSPENDED') {
            toast.error('Akun Anda ditangguhkan.');
          } else {
            toast.error(error.message || 'Login gagal. Silakan coba lagi.');
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
        <CardTitle className='text-xl'>Masuk</CardTitle>
        <CardDescription>Masukkan email dan password untuk masuk ke akun Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4' noValidate>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='nama@email.com'
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete='username'
              disabled={loginMutation.isPending}
            />
            {errors.email && (
              <p id='email-error' className='text-xs text-destructive'>
                {errors.email}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>Password</Label>
            </div>
            <div className='relative'>
              <Input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Masukkan password'
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                autoComplete='current-password'
                disabled={loginMutation.isPending}
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

          <Button
            type='submit'
            className='w-full'
            size='lg'
            loading={loginMutation.isPending}
          >
            Masuk
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          Belum punya akun?{' '}
          <Link href='/register' className='font-medium text-primary hover:underline'>
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
