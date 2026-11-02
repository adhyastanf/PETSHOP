import api from '@/lib/api';
import type {
  ApplyMerchantRequest,
  MerchantApplicationResponse,
  MerchantProfile,
  UpdateMerchantProfileRequest,
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchHours,
  DayHours,
  Staff,
  AddStaffRequest,
  UpdateStaffRequest,
  StaffBranch,
  AssignBranchRequest,
  VerifyMerchantRequest,
  VerifyVetRequest,
} from './types';

/**
 * Service layer for the merchant/mitra APIs. All requests go through the
 * axios instance in `@/lib/api`, which targets the same-origin Next.js API
 * proxy (`/api/...`) and relies on the proxy for httpOnly-cookie auth.
 * Endpoints are relative to the backend API base (e.g. `/merchant/profile`).
 */
export const merchantService = {
  // Application
  async apply(data: ApplyMerchantRequest): Promise<MerchantApplicationResponse> {
    return (await api.post<MerchantApplicationResponse>('/merchant/applications', data)).data;
  },
  async getMyApplications(): Promise<MerchantApplicationResponse[]> {
    return (await api.get<MerchantApplicationResponse[]>('/merchant/applications/mine')).data;
  },

  // Profile
  async getProfile(): Promise<MerchantProfile> {
    return (await api.get<MerchantProfile>('/merchant/profile')).data;
  },
  async updateProfile(data: UpdateMerchantProfileRequest): Promise<MerchantProfile> {
    return (await api.patch<MerchantProfile>('/merchant/profile', data)).data;
  },

  // Branches
  async getBranches(): Promise<Branch[]> {
    return (await api.get<Branch[]>('/merchant/branches')).data;
  },
  async getBranch(id: string): Promise<Branch> {
    return (await api.get<Branch>(`/merchant/branches/${id}`)).data;
  },
  async createBranch(data: CreateBranchRequest): Promise<Branch> {
    return (await api.post<Branch>('/merchant/branches', data)).data;
  },
  async updateBranch(id: string, data: UpdateBranchRequest): Promise<Branch> {
    return (await api.patch<Branch>(`/merchant/branches/${id}`, data)).data;
  },

  // Branch Hours
  async getBranchHours(branchId: string): Promise<BranchHours> {
    return (await api.get<BranchHours>(`/merchant/branches/${branchId}/hours`)).data;
  },
  async setBranchHours(branchId: string, hours: DayHours[]): Promise<BranchHours> {
    return (await api.put<BranchHours>(`/merchant/branches/${branchId}/hours`, { hours })).data;
  },

  // Staff
  async getStaff(): Promise<Staff[]> {
    return (await api.get<Staff[]>('/merchant/staff')).data;
  },
  async addStaff(data: AddStaffRequest): Promise<Staff> {
    return (await api.post<Staff>('/merchant/staff', data)).data;
  },
  async updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    return (await api.patch<Staff>(`/merchant/staff/${id}`, data)).data;
  },
  async deleteStaff(id: string): Promise<void> {
    await api.delete(`/merchant/staff/${id}`);
  },

  // Staff Branches
  async getStaffBranches(staffId: string): Promise<StaffBranch[]> {
    return (await api.get<StaffBranch[]>(`/merchant/staff/${staffId}/branches`)).data;
  },
  async assignStaffBranch(staffId: string, data: AssignBranchRequest): Promise<StaffBranch> {
    return (await api.post<StaffBranch>(`/merchant/staff/${staffId}/branches`, data)).data;
  },
  async removeStaffBranch(staffId: string, branchId: string): Promise<void> {
    await api.delete(`/merchant/staff/${staffId}/branches/${branchId}`);
  },

  // Admin
  async getAllApplications(): Promise<MerchantApplicationResponse[]> {
    return (await api.get<MerchantApplicationResponse[]>('/admin/merchants/applications')).data;
  },
  async verifyMerchant(merchantId: string, data: VerifyMerchantRequest): Promise<MerchantProfile> {
    return (await api.post<MerchantProfile>(`/admin/merchants/${merchantId}/verify`, data)).data;
  },
  async getAllVeterinarians(): Promise<Staff[]> {
    return (await api.get<Staff[]>('/admin/veterinarians')).data;
  },
  async verifyVet(staffId: string, data: VerifyVetRequest): Promise<void> {
    await api.post(`/admin/veterinarians/${staffId}/verify`, data);
  },
};
