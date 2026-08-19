package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.VerifyVetRequest;
import com.petshop.api.merchant.application.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/veterinarians")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
public class VetVerificationController {

    private final StaffService staffService;

    public VetVerificationController(StaffService staffService) {
        this.staffService = staffService;
    }

    /**
     * US-MER-010: Admin verifies or rejects veterinarian credentials.
     */
    @PostMapping("/{staffId}/verify")
    public ResponseEntity<Void> verifyVeterinarian(
            @PathVariable UUID staffId,
            @Valid @RequestBody VerifyVetRequest request) {
        UUID adminUserId = currentUserId();
        staffService.verifyVeterinarian(adminUserId, staffId, request);
        return ResponseEntity.ok().build();
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
