import api from '@/lib/api';
import type { Address, AddressRequest, CustomerProfile, Pet, PetBreed, PetRequest, PetType, UpdateCustomerProfileRequest, Vaccination } from '../types/address-types';

export const customerService = {
  async profile(): Promise<CustomerProfile> {
    const response = await api.get<CustomerProfile>('/customer/profile');
    return response.data;
  },
  async updateProfile(data: UpdateCustomerProfileRequest): Promise<CustomerProfile> {
    const response = await api.patch<CustomerProfile>('/customer/profile', data);
    return response.data;
  },
  async addresses(): Promise<Address[]> {
    const response = await api.get<Address[]>('/customer/addresses');
    return response.data;
  },
  async address(id: string): Promise<Address> {
    const response = await api.get<Address>('/customer/addresses/'.concat(id));
    return response.data;
  },
  async createAddress(data: AddressRequest): Promise<Address> {
    const response = await api.post<Address>('/customer/addresses', data);
    return response.data;
  },
  async updateAddress(id: string, data: AddressRequest): Promise<Address> {
    const response = await api.patch<Address>(`/customer/addresses/${id}`, data);
    return response.data;
  },
  async setDefaultAddress(id: string): Promise<Address> {
    const response = await api.patch<Address>(`/customer/addresses/${id}/default`, { isDefault: true });
    return response.data;
  },
  async deleteAddress(id: string): Promise<void> {
    await api.delete<void>(`/customer/addresses/${id}`);
  },
  async petTypes(): Promise<PetType[]> {
    const response = await api.get<PetType[]>('/pets/types');
    return response.data;
  },
  async breeds(petTypeId: string): Promise<PetBreed[]> {
    const response = await api.get<PetBreed[]>(`/pets/breeds`, {
      params: { petTypeId },
    });
    return response.data;
  },
  async pets(): Promise<Pet[]> {
    const response = await api.get<Pet[]>('/pets');
    return response.data;
  },
  async pet(id: string) : Promise<Pet> {
    const response = await api.get<Pet>(`/pets/${id}`);
    return response.data;
  },
  async createPet(data: PetRequest): Promise<Pet> {
    const response = await api.post<Pet>('/pets', data);
    return response.data;
  },
  async updatePet(id: string, data: PetRequest): Promise<Pet> {
    const response = await api.patch<Pet>(`/pets/${id}`, data);
    return response.data;
  },
  async deletePet(id: string): Promise<void> {
    await api.delete<void>(`/pets/${id}`);
  },
  async vaccinations(petId: string): Promise<Vaccination[]> {
    const response = await api.get<Vaccination[]>(`/pets/${petId}/vaccinations`);
    return response.data;
  },
};
