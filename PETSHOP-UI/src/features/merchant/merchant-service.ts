import { apiClient } from '@/lib/api-client';
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

export const merchantService = {
  // Application
  apply(data: ApplyMerchantRequest): Promise<MerchantApplicationResponse> {
    return apiClient<MerchantApplicationResponse>('/merchant/applications', { method: 'POST', body: data });
  },
  getMyApplications(): Promise<MerchantApplicationResponse[]> {
    return apiClient<MerchantApplicationResponse[]>('/merchant/applications/mine');
  },

  // Profile
  getProfile(): Promise<MerchantProfile> {
    return apiClient<MerchantProfile>('/merchant/profile');
  },
  updateProfile(data: UpdateMerchantProfileRequest): Promise<MerchantProfile> {
    return apiClient<MerchantProfile>('/merchant/profile', { method: 'PATCH', body: data });
  },

  // Branches
  getBranches(): Promise<Branch[]> {
    return apiClient<Branch[]>('/merchant/branches');
  },
  getBranch(id: string): Promise<Branch> {
    return apiClient<Branch>(`/merchant/branches/${id}`);
  },
  createBranch(data: CreateBranchRequest): Promise<Branch> {
    return apiClient<Branch>('/merchant/branches', { method: 'POST', body: data });
  },
  updateBranch(id: string, data: UpdateBranchRequest): Promise<Branch> {
    return apiClient<Branch>(`/merchant/branches/${id}`, { method: 'PATCH', body: data });
  },

  // Branch Hours
  getBranchHours(branchId: string): Promise<BranchHours> {
    return apiClient<BranchHours>(`/merchant/branches/${branchId}/hours`);
  },
  setBranchHours(branchId: string, hours: DayHours[]): Promise<BranchHours> {
    return apiClient<BranchHours>(`/merchant/branches/${branchId}/hours`, { method: 'PUT', body: { hours } });
  },

  // Staff
  getStaff(): Promise<Staff[]> {
    return apiClient<Staff[]>('/merchant/staff');
  },
  addStaff(data: AddStaffRequest): Promise<Staff> {
    return apiClient<Staff>('/merchant/staff', { method: 'POST', body: data });
  },
  updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff> {
    return apiClient<Staff>(`/merchant/staff/${id}`, { method: 'PATCH', body: data });
  },
  deleteStaff(id: string): Promise<void> {
    return apiClient<void>(`/merchant/staff/${id}`, { method: 'DELETE' });
  },

  // Staff Branches
  getStaffBranches(staffId: string): Promise<StaffBranch[]> {
    return apiClient<StaffBranch[]>(`/merchant/staff/${staffId}/branches`);
  },
  assignStaffBranch(staffId: string, data: AssignBranchRequest): Promise<StaffBranch> {
    return apiClient<StaffBranch>(`/merchant/staff/${staffId}/branches`, { method: 'POST', body: data });
  },
  removeStaffBranch(staffId: string, branchId: string): Promise<void> {
    return apiClient<void>(`/merchant/staff/${staffId}/branches/${branchId}`, { method: 'DELETE' });
  },

  // Admin
  getAllApplications(): Promise<MerchantApplicationResponse[]> {
    return apiClient<MerchantApplicationResponse[]>('/admin/merchants/applications');
  },
  verifyMerchant(merchantId: string, data: VerifyMerchantRequest): Promise<MerchantProfile> {
    return apiClient<MerchantProfile>(`/admin/merchants/${merchantId}/verify`, { method: 'POST', body: data });
  },
  getAllVeterinarians(): Promise<Staff[]> {
    return apiClient<Staff[]>('/admin/veterinarians');
  },
  verifyVet(staffId: string, data: VerifyVetRequest): Promise<void> {
    return apiClient<void>(`/admin/veterinarians/${staffId}/verify`, { method: 'POST', body: data });
  },
};
