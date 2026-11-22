'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import type { AddressRequest, PetRequest, UpdateCustomerProfileRequest } from '../types/address-types';
import { AUTH_QUERY_KEYS } from './use-auth';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-error';
import { getErrorMessage } from '@/utils/get-error-message';
import { useCallback, useEffect } from 'react';

function useQueryErrorToast<T extends { error: Error | null }>(query: T): T {
  const onError = useApiErrorToast();
  useEffect(() => {
    if (query.error) onError(query.error as ApiError);
  }, [onError, query.error]);
  return query;
}

function useApiErrorToast() {
  const t = useTranslations();
  return useCallback((error: ApiError) => toast.error(getErrorMessage(error, t)), [t]);
}

export const CUSTOMER_KEYS = {
  profile: ['customer', 'profile'] as const,
  addresses: ['customer', 'addresses'] as const,
  address: (addressId: string) => ['customer', 'addresses', addressId] as const,
  petTypes: ['pets', 'types'] as const,
  breeds: (petTypeId: string) => ['pets', 'breeds', petTypeId] as const,
  pets: ['pets'] as const,
  pet: (petId: string) => ['pets', petId] as const,
  vaccinations: (petId: string) => ['pets', petId, 'vaccinations'] as const,
};

export function useCustomerProfile() {
  return useQueryErrorToast(useQuery({ queryKey: CUSTOMER_KEYS.profile, queryFn: customerService.profile }));
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (data: UpdateCustomerProfileRequest) => customerService.updateProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(CUSTOMER_KEYS.profile, profile);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
    onError,
  });
}

export function useAddresses() {
  return useQueryErrorToast(useQuery({ queryKey: CUSTOMER_KEYS.addresses, queryFn: customerService.addresses }));
}

export function useAddress(id: string | null) {
  return useQueryErrorToast(useQuery({
    queryKey: CUSTOMER_KEYS.address(id ?? ''),
    queryFn: () => customerService.address(id!),
    enabled: Boolean(id),
  }));
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (data: AddressRequest) => customerService.createAddress(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
    onError,
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: AddressRequest }) => customerService.updateAddress(id!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
    onError,
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (id: string) => customerService.setDefaultAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
    onError,
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (id: string) => customerService.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
    onError,
  });
}

export function usePetTypes() {
  return useQueryErrorToast(useQuery({ queryKey: CUSTOMER_KEYS.petTypes, queryFn: customerService.petTypes }));
}

export function usePet(id: string | null) {
  return useQueryErrorToast(useQuery({
    queryKey: CUSTOMER_KEYS.pet(id ?? ''),
    queryFn: () => customerService.pet(id!),
    enabled: Boolean(id),
  }));
}

export function useBreeds(petTypeId: string) {
  return useQueryErrorToast(useQuery({
    queryKey: CUSTOMER_KEYS.breeds(petTypeId),
    queryFn: () => customerService.breeds(petTypeId),
    enabled: Boolean(petTypeId),
  }));
}

export function usePets() {
  return useQueryErrorToast(useQuery({ queryKey: CUSTOMER_KEYS.pets, queryFn: customerService.pets }));
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (data: PetRequest) => customerService.createPet(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
    onError,
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: PetRequest }) => customerService.updatePet(id!, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
    onError,
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  const onError = useApiErrorToast();
  return useMutation({
    mutationFn: (id: string | null) => customerService.deletePet(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
    onError,
  });
}

export function useVaccinations(petId: string | null) {
  return useQueryErrorToast(useQuery({
    queryKey: petId ? CUSTOMER_KEYS.vaccinations(petId) : ['pets', 'none', 'vaccinations'],
    queryFn: () => customerService.vaccinations(petId ?? ''),
    enabled: Boolean(petId),
  }));
}
