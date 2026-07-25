'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerService } from './customer-service';
import type { AddressRequest, PetRequest, UpdateCustomerProfileRequest } from './types';

export const CUSTOMER_KEYS = {
  profile: ['customer', 'profile'] as const,
  addresses: ['customer', 'addresses'] as const,
  petTypes: ['pets', 'types'] as const,
  breeds: (petTypeId: string) => ['pets', 'breeds', petTypeId] as const,
  pets: ['pets'] as const,
  vaccinations: (petId: string) => ['pets', petId, 'vaccinations'] as const,
};

export function useCustomerProfile() {
  return useQuery({ queryKey: CUSTOMER_KEYS.profile, queryFn: customerService.profile });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCustomerProfileRequest) => customerService.updateProfile(data),
    onSuccess: (profile) => queryClient.setQueryData(CUSTOMER_KEYS.profile, profile),
  });
}

export function useAddresses() {
  return useQuery({ queryKey: CUSTOMER_KEYS.addresses, queryFn: customerService.addresses });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressRequest) => customerService.createAddress(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressRequest }) =>
      customerService.updateAddress(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.setDefaultAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.addresses }),
  });
}

export function usePetTypes() {
  return useQuery({ queryKey: CUSTOMER_KEYS.petTypes, queryFn: customerService.petTypes });
}

export function useBreeds(petTypeId: string) {
  return useQuery({
    queryKey: CUSTOMER_KEYS.breeds(petTypeId),
    queryFn: () => customerService.breeds(petTypeId),
    enabled: Boolean(petTypeId),
  });
}

export function usePets() {
  return useQuery({ queryKey: CUSTOMER_KEYS.pets, queryFn: customerService.pets });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PetRequest) => customerService.createPet(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetRequest }) => customerService.updatePet(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerService.deletePet(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.pets }),
  });
}

export function useVaccinations(petId: string | null) {
  return useQuery({
    queryKey: petId ? CUSTOMER_KEYS.vaccinations(petId) : ['pets', 'none', 'vaccinations'],
    queryFn: () => customerService.vaccinations(petId ?? ''),
    enabled: Boolean(petId),
  });
}
