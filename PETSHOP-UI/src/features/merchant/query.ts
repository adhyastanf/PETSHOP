'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { merchantService } from './merchant-service';
import type {
  ApplyMerchantRequest,
  UpdateMerchantProfileRequest,
  CreateBranchRequest,
  UpdateBranchRequest,
  DayHours,
  AddStaffRequest,
  UpdateStaffRequest,
  AssignBranchRequest,
  VerifyMerchantRequest,
  VerifyVetRequest,
} from './types';

export const MERCHANT_KEYS = {
  applications: ['merchant', 'applications'] as const,
  profile: ['merchant', 'profile'] as const,
  branches: ['merchant', 'branches'] as const,
  branch: (id: string) => ['merchant', 'branches', id] as const,
  branchHours: (id: string) => ['merchant', 'branches', id, 'hours'] as const,
  staff: ['merchant', 'staff'] as const,
  staffBranches: (staffId: string) => ['merchant', 'staff', staffId, 'branches'] as const,
};

// Application
export function useMyApplications() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: MERCHANT_KEYS.applications, queryFn: merchantService.getMyApplications, enabled: isAuthenticated });
}

export function useApplyMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ApplyMerchantRequest) => merchantService.apply(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.applications }),
  });
}

// Profile
export function useMerchantProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: MERCHANT_KEYS.profile, queryFn: merchantService.getProfile, enabled: isAuthenticated });
}

export function useUpdateMerchantProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMerchantProfileRequest) => merchantService.updateProfile(data),
    onSuccess: (profile) => qc.setQueryData(MERCHANT_KEYS.profile, profile),
  });
}

// Branches
export function useBranches() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: MERCHANT_KEYS.branches, queryFn: merchantService.getBranches, enabled: isAuthenticated });
}

export function useBranch(id: string) {
  return useQuery({ queryKey: MERCHANT_KEYS.branch(id), queryFn: () => merchantService.getBranch(id), enabled: Boolean(id) });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchRequest) => merchantService.createBranch(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.branches }),
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchRequest }) => merchantService.updateBranch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.branches }),
  });
}

// Branch Hours
export function useBranchHours(branchId: string) {
  return useQuery({ queryKey: MERCHANT_KEYS.branchHours(branchId), queryFn: () => merchantService.getBranchHours(branchId), enabled: Boolean(branchId) });
}

export function useSetBranchHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ branchId, hours }: { branchId: string; hours: DayHours[] }) => merchantService.setBranchHours(branchId, hours),
    onSuccess: (_, { branchId }) => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.branchHours(branchId) }),
  });
}

// Staff
export function useStaff() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: MERCHANT_KEYS.staff, queryFn: merchantService.getStaff, enabled: isAuthenticated });
}

export function useAddStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddStaffRequest) => merchantService.addStaff(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.staff }),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffRequest }) => merchantService.updateStaff(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.staff }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantService.deleteStaff(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.staff }),
  });
}

// Staff Branches
export function useStaffBranches(staffId: string) {
  return useQuery({ queryKey: MERCHANT_KEYS.staffBranches(staffId), queryFn: () => merchantService.getStaffBranches(staffId), enabled: Boolean(staffId) });
}

export function useAssignStaffBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: AssignBranchRequest }) => merchantService.assignStaffBranch(staffId, data),
    onSuccess: (_, { staffId }) => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.staffBranches(staffId) }),
  });
}

export function useRemoveStaffBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, branchId }: { staffId: string; branchId: string }) => merchantService.removeStaffBranch(staffId, branchId),
    onSuccess: (_, { staffId }) => qc.invalidateQueries({ queryKey: MERCHANT_KEYS.staffBranches(staffId) }),
  });
}

// Admin
export function useAllApplications() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: ['admin', 'applications'], queryFn: merchantService.getAllApplications, enabled: isAuthenticated });
}

export function useAllVeterinarians() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({ queryKey: ['admin', 'veterinarians'], queryFn: merchantService.getAllVeterinarians, enabled: isAuthenticated });
}

export function useVerifyMerchant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ merchantId, data }: { merchantId: string; data: VerifyMerchantRequest }) => merchantService.verifyMerchant(merchantId, data),
    // Admin list uses the ['admin','applications'] query key; invalidate it so the
    // table reflects the new status instantly. Also refresh the merchant-scoped key.
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
      qc.invalidateQueries({ queryKey: MERCHANT_KEYS.applications });
    },
  });
}

export function useVerifyVet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: VerifyVetRequest }) => merchantService.verifyVet(staffId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'veterinarians'] }),
  });
}
