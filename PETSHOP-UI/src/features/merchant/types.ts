// Merchant Application
export interface ApplyMerchantRequest {
  businessName: string;
  displayName?: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  nib?: string;
  npwp?: string;
}

export interface MerchantApplicationResponse {
  id: string;
  businessName: string;
  displayName: string | null;
  verificationStatus: string;
  createdAt: string;
}

// Merchant Profile
export interface MerchantProfile {
  id: string;
  businessName: string;
  displayName: string | null;
  description: string | null;
  email: string | null;
  phoneNumber: string | null;
  whatsappNumber: string | null;
  nib: string | null;
  npwp: string | null;
  verificationStatus: string;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateMerchantProfileRequest {
  displayName?: string;
  description?: string;
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
}

// Branch
export interface Branch {
  id: string;
  merchantId: string;
  code: string;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  provinceName: string | null;
  cityName: string | null;
  districtName: string | null;
  subdistrictName: string | null;
  postalCode: string | null;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBranchRequest {
  name: string;
  phoneNumber?: string;
  email?: string;
  provinceName?: string;
  cityName?: string;
  districtName?: string;
  subdistrictName?: string;
  postalCode?: string;
  addressLine?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateBranchRequest {
  name?: string;
  phoneNumber?: string;
  email?: string;
  provinceName?: string;
  cityName?: string;
  districtName?: string;
  subdistrictName?: string;
  postalCode?: string;
  addressLine?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}

// Branch Hours
export interface DayHours {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface BranchHours {
  branchId: string;
  hours: DayHours[];
}

// Staff
export interface Staff {
  id: string;
  merchantId: string;
  userId: string;
  userFullName: string;
  roleCode: string;
  roleName: string;
  employeeCode: string | null;
  displayName: string | null;
  status: string;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddStaffRequest {
  email: string;
  roleCode: string;
  employeeCode?: string;
  displayName?: string;
}

export interface UpdateStaffRequest {
  status?: string;
  displayName?: string;
}

export interface StaffBranch {
  staffId: string;
  branchId: string;
  branchName: string;
  branchCode: string;
}

export interface AssignBranchRequest {
  branchId: string;
}

// Admin verification
export interface VerifyMerchantRequest {
  decision: string;
  notes?: string;
  rejectionReason?: string;
}

export interface VerifyVetRequest {
  decision: string;
  notes?: string;
}
