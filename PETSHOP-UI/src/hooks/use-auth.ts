import { ApiError } from '@/lib/api-error';
import { authService } from '@/services/auth.service';
// import { loginService, logoutService, meService, registerService } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/get-error-message';
import { getHomeRoute } from '@/utils/route-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'] as const,
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      try {
        const userData = await queryClient.ensureQueryData({
          queryKey: AUTH_QUERY_KEYS.me,
          queryFn: authService.me,
        });

        const roles = userData?.roles || [];
        const destination = getHomeRoute(roles);

        toast.success('Login berhasil!');
        router.replace(destination);
        router.refresh();
      } catch {
        // Kosongkan atau biarkan kosong sesuai permintaan
      }
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, t));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
      router.push('/');
      router.refresh();
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, t));
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const t = useTranslations();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error, t));
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: authService.me,
    staleTime: 5 * 60 * 1000,
  });
}
