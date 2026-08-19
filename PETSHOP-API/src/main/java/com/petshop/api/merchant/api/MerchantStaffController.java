package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.*;
import com.petshop.api.merchant.application.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchant/staff")
@PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN', 'ROLE_PETSHOP_STAFF', 'ROLE_GROOMER', 'ROLE_VETERINARIAN')")
public class MerchantStaffController {

    private final StaffService staffService;

    public MerchantStaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    /**
     * US-MER-008: Add a staff member to the current user's merchant.
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<StaffResponse> addStaff(@Valid @RequestBody AddStaffRequest request) {
        UUID userId = currentUserId();
        StaffResponse response = staffService.addStaff(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * US-MER-008: List all staff for the current user's merchant.
     */
    @GetMapping
    public ResponseEntity<List<StaffResponse>> listStaff() {
        UUID userId = currentUserId();
        List<StaffResponse> response = staffService.listStaff(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-008: Update a staff member (status, display name).
     */
    @PatchMapping("/{staffId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable UUID staffId,
            @Valid @RequestBody UpdateStaffRequest request) {
        UUID userId = currentUserId();
        StaffResponse response = staffService.updateStaff(userId, staffId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-008: Soft-delete (deactivate) a staff member.
     */
    @DeleteMapping("/{staffId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<Void> deleteStaff(@PathVariable UUID staffId) {
        UUID userId = currentUserId();
        staffService.deleteStaff(userId, staffId);
        return ResponseEntity.noContent().build();
    }

    /**
     * US-MER-009: Assign staff to a branch.
     */
    @PostMapping("/{staffId}/branches")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<StaffBranchResponse> assignBranch(
            @PathVariable UUID staffId,
            @Valid @RequestBody AssignBranchRequest request) {
        UUID userId = currentUserId();
        StaffBranchResponse response = staffService.assignBranch(userId, staffId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * US-MER-009: List staff branch assignments.
     */
    @GetMapping("/{staffId}/branches")
    public ResponseEntity<List<StaffBranchResponse>> listStaffBranches(@PathVariable UUID staffId) {
        UUID userId = currentUserId();
        List<StaffBranchResponse> response = staffService.listStaffBranches(userId, staffId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-009: Remove staff from a branch.
     */
    @DeleteMapping("/{staffId}/branches/{branchId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<Void> removeBranchAssignment(
            @PathVariable UUID staffId,
            @PathVariable UUID branchId) {
        UUID userId = currentUserId();
        staffService.removeBranchAssignment(userId, staffId, branchId);
        return ResponseEntity.noContent().build();
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
