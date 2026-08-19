package com.petshop.api.merchant.application;

import com.petshop.api.merchant.api.dto.*;

import java.util.List;
import java.util.UUID;

public interface MerchantService {

    MerchantApplicationResponse applyMerchant(UUID userId, ApplyMerchantRequest request);

    List<MerchantApplicationResponse> getMyApplications(UUID userId);

    MerchantSummaryResponse verifyMerchant(UUID adminUserId, UUID merchantId, VerifyMerchantRequest request);

    List<MerchantApplicationResponse> getAllApplications();

    // US-MER-004: Profile management
    MerchantProfileResponse getProfile(UUID userId);

    MerchantProfileResponse updateProfile(UUID userId, UpdateMerchantProfileRequest request);

    // US-MER-005: Create branch
    BranchResponse createBranch(UUID userId, CreateBranchRequest request);

    // US-MER-006: Manage branches
    List<BranchResponse> listBranches(UUID userId);

    // Staff read-only access
    List<BranchResponse> listBranchesForStaff(UUID userId);

    BranchResponse getBranch(UUID userId, UUID branchId);

    BranchResponse updateBranch(UUID userId, UUID branchId, UpdateBranchRequest request);

    // US-MER-007: Branch hours
    BranchHoursResponse getBranchHours(UUID userId, UUID branchId);

    BranchHoursResponse setBranchHours(UUID userId, UUID branchId, SetBranchHoursRequest request);
}
