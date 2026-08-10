import { ApiError } from '@/lib/api-error';
import { loginService, logoutService, meService, registerService } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/get-error-message';
import { getHomeRoute } from '@/utils/route-utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginService,
    onSuccess: async () => {
      try {
        const userData = await queryClient.ensureQueryData({
          queryKey: ['me'],
          queryFn: meService,
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
      toast.error(getErrorMessage(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutService,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      router.push('/');
      router.refresh();
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: registerService,
    onSuccess: () => {
      router.push('/login');
    },
    onError: (error: ApiError) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: meService,
    staleTime: 5 * 60 * 1000,
  });
}
