package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.MerchantApplicationResponse;
import com.petshop.api.merchant.api.dto.MerchantSummaryResponse;
import com.petshop.api.merchant.api.dto.StaffResponse;
import com.petshop.api.merchant.api.dto.VerifyMerchantRequest;
import com.petshop.api.merchant.application.MerchantService;
import com.petshop.api.merchant.application.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPER_ADMIN')")
public class MerchantAdminController {

    private final MerchantService merchantService;
    private final StaffService staffService;

    public MerchantAdminController(MerchantService merchantService, StaffService staffService) {
        this.merchantService = merchantService;
        this.staffService = staffService;
    }

    /**
     * Admin: list all merchant applications.
     */
    @GetMapping("/merchants/applications")
    public ResponseEntity<List<MerchantApplicationResponse>> listAllApplications() {
        return ResponseEntity.ok(merchantService.getAllApplications());
    }

    /**
     * US-MER-003: Verify (approve/reject) a merchant application.
     */
    @PostMapping("/merchants/{merchantId}/verify")
    public ResponseEntity<MerchantSummaryResponse> verifyMerchant(
            @PathVariable UUID merchantId,
            @Valid @RequestBody VerifyMerchantRequest request) {
        UUID adminUserId = currentUserId();
        MerchantSummaryResponse response = merchantService.verifyMerchant(adminUserId, merchantId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Admin: list all veterinarian staff across all merchants.
     */
    @GetMapping("/veterinarians")
    public ResponseEntity<List<StaffResponse>> listVeterinarians() {
        return ResponseEntity.ok(staffService.listAllVeterinarians());
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
