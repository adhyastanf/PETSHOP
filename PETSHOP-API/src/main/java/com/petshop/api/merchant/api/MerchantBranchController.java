package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.*;
import com.petshop.api.merchant.application.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchant/branches")
@PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN', 'ROLE_PETSHOP_STAFF', 'ROLE_GROOMER', 'ROLE_VETERINARIAN')")
public class MerchantBranchController {

    private final MerchantService merchantService;

    public MerchantBranchController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    /**
     * US-MER-005: Create a new branch for the current user's merchant.
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<BranchResponse> createBranch(@Valid @RequestBody CreateBranchRequest request) {
        UUID userId = currentUserId();
        BranchResponse response = merchantService.createBranch(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * US-MER-006: List branches for the current user's merchant.
     */
    @GetMapping
    public ResponseEntity<List<BranchResponse>> listBranches() {
        UUID userId = currentUserId();
        List<BranchResponse> response = merchantService.listBranches(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-006: Get a specific branch detail.
     */
    @GetMapping("/{branchId}")
    public ResponseEntity<BranchResponse> getBranch(@PathVariable UUID branchId) {
        UUID userId = currentUserId();
        BranchResponse response = merchantService.getBranch(userId, branchId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-006: Update a branch.
     */
    @PatchMapping("/{branchId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<BranchResponse> updateBranch(
            @PathVariable UUID branchId,
            @Valid @RequestBody UpdateBranchRequest request) {
        UUID userId = currentUserId();
        BranchResponse response = merchantService.updateBranch(userId, branchId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-007: Get operating hours for a branch.
     */
    @GetMapping("/{branchId}/hours")
    public ResponseEntity<BranchHoursResponse> getBranchHours(@PathVariable UUID branchId) {
        UUID userId = currentUserId();
        BranchHoursResponse response = merchantService.getBranchHours(userId, branchId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-007: Set operating hours for a branch (replace all).
     */
    @PutMapping("/{branchId}/hours")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<BranchHoursResponse> setBranchHours(
            @PathVariable UUID branchId,
            @Valid @RequestBody SetBranchHoursRequest request) {
        UUID userId = currentUserId();
        BranchHoursResponse response = merchantService.setBranchHours(userId, branchId, request);
        return ResponseEntity.ok(response);
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
