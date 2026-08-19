package com.petshop.api.merchant.api.dto;

import java.util.UUID;

public record StaffBranchResponse(
        UUID staffId,
        UUID branchId,
        String branchName,
        String branchCode
) {}
