export interface CustomerProfile {
  userId: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  profileImageFileId: string | null;
  gender: string | null;
  birthDate: string | null;
}

export interface UpdateCustomerProfileRequest {
  fullName: string;
  phoneNumber: string;
  gender: string;
  birthDate: string | null;
}

export interface Address {
  id: string;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  provinceCode: string | null;
  provinceName: string | null;
  cityCode: string | null;
  cityName: string | null;
  districtCode: string | null;
  districtName: string | null;
  subdistrictCode: string | null;
  subdistrictName: string | null;
  postalCode: string;
  addressLine: string;
  latitude: string | null;
  longitude: string | null;
  notes: string | null;
  isDefault: boolean;
}

export type AddressRequest = Omit<Address, 'id'>;

export interface PetType {
  id: string;
  code: string;
  name: string;
  sortOrder: number | null;
}

export interface PetBreed {
  id: string;
  petTypeId: string;
  name: string;
}

export interface Pet {
  id: string;
  name: string;
  petTypeId: string;
  petTypeCode: string;
  petTypeName: string;
  breedId: string | null;
  breedName: string | null;
  gender: string | null;
  birthDate: string | null;
  birthDateEstimated: boolean;
  weightKg: string | null;
  color: string | null;
  sterilized: boolean | null;
  microchipNumber: string | null;
  profileImageFileId: string | null;
  allergies: string | null;
  specialNotes: string | null;
}

export interface PetRequest {
  name: string;
  petTypeId: string;
  breedId: string | null;
  gender: string;
  birthDate: string | null;
  birthDateEstimated: boolean;
  weightKg: string | null;
  color: string;
  sterilized: boolean;
  microchipNumber: string;
  profileImageFileId: string | null;
  allergies: string;
  specialNotes: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineTypeId: string | null;
  vaccineTypeName: string | null;
  bookingId: string | null;
  merchantId: string | null;
  branchId: string | null;
  veterinarianStaffId: string | null;
  vaccineNameSnapshot: string;
  vaccinationDate: string;
  nextVaccinationDate: string | null;
  batchNumber: string | null;
  certificateFileId: string | null;
  notes: string | null;
}
