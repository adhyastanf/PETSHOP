import { apiClient } from '@/lib/api-client';
import type {
  Address,
  AddressRequest,
  CustomerProfile,
  Pet,
  PetBreed,
  PetRequest,
  PetType,
  UpdateCustomerProfileRequest,
  Vaccination,
} from './types';

export const customerService = {
  profile(): Promise<CustomerProfile> {
    return apiClient<CustomerProfile>('/customer/profile');
  },
  updateProfile(data: UpdateCustomerProfileRequest): Promise<CustomerProfile> {
    return apiClient<CustomerProfile>('/customer/profile', { method: 'PATCH', body: data });
  },
  addresses(): Promise<Address[]> {
    return apiClient<Address[]>('/customer/addresses');
  },
  createAddress(data: AddressRequest): Promise<Address> {
    return apiClient<Address>('/customer/addresses', { method: 'POST', body: data });
  },
  updateAddress(id: string, data: AddressRequest): Promise<Address> {
    return apiClient<Address>(`/customer/addresses/${id}`, { method: 'PATCH', body: data });
  },
  setDefaultAddress(id: string): Promise<Address> {
    return apiClient<Address>(`/customer/addresses/${id}/default`, {
      method: 'PATCH',
      body: { isDefault: true },
    });
  },
  deleteAddress(id: string): Promise<void> {
    return apiClient<void>(`/customer/addresses/${id}`, { method: 'DELETE' });
  },
  petTypes(): Promise<PetType[]> {
    return apiClient<PetType[]>('/pets/types');
  },
  breeds(petTypeId: string): Promise<PetBreed[]> {
    return apiClient<PetBreed[]>(`/pets/breeds?petTypeId=${petTypeId}`);
  },
  pets(): Promise<Pet[]> {
    return apiClient<Pet[]>('/pets');
  },
  createPet(data: PetRequest): Promise<Pet> {
    return apiClient<Pet>('/pets', { method: 'POST', body: data });
  },
  updatePet(id: string, data: PetRequest): Promise<Pet> {
    return apiClient<Pet>(`/pets/${id}`, { method: 'PATCH', body: data });
  },
  deletePet(id: string): Promise<void> {
    return apiClient<void>(`/pets/${id}`, { method: 'DELETE' });
  },
  vaccinations(petId: string): Promise<Vaccination[]> {
    return apiClient<Vaccination[]>(`/pets/${petId}/vaccinations`);
  },
};
