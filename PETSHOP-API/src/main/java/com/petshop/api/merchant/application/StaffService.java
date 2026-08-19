package com.petshop.api.merchant.application;

import com.petshop.api.merchant.api.dto.*;

import java.util.List;
import java.util.UUID;

public interface StaffService {

    // US-MER-008: Manage Staff
    StaffResponse addStaff(UUID userId, AddStaffRequest request);

    List<StaffResponse> listStaff(UUID userId);

    StaffResponse updateStaff(UUID userId, UUID staffId, UpdateStaffRequest request);

    void deleteStaff(UUID userId, UUID staffId);

    // US-MER-009: Staff Branch Assignment
    StaffBranchResponse assignBranch(UUID userId, UUID staffId, AssignBranchRequest request);

    List<StaffBranchResponse> listStaffBranches(UUID userId, UUID staffId);

    void removeBranchAssignment(UUID userId, UUID staffId, UUID branchId);

    // US-MER-010: Veterinarian Verification
    void verifyVeterinarian(UUID adminUserId, UUID staffId, VerifyVetRequest request);

    // Admin: list all veterinarians across all merchants
    List<StaffResponse> listAllVeterinarians();
}
