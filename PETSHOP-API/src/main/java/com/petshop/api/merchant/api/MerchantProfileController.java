package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.MerchantProfileResponse;
import com.petshop.api.merchant.api.dto.UpdateMerchantProfileRequest;
import com.petshop.api.merchant.application.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchant/profile")
@PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN', 'ROLE_PETSHOP_STAFF', 'ROLE_GROOMER', 'ROLE_VETERINARIAN')")
public class MerchantProfileController {

    private final MerchantService merchantService;

    public MerchantProfileController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    /**
     * US-MER-004: Get current user's approved merchant profile.
     */
    @GetMapping
    public ResponseEntity<MerchantProfileResponse> getProfile() {
        UUID userId = currentUserId();
        MerchantProfileResponse response = merchantService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * US-MER-004: Update permitted fields of the merchant profile.
     */
    @PatchMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PETSHOP_OWNER', 'ROLE_PETSHOP_ADMIN')")
    public ResponseEntity<MerchantProfileResponse> updateProfile(
            @Valid @RequestBody UpdateMerchantProfileRequest request) {
        UUID userId = currentUserId();
        MerchantProfileResponse response = merchantService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
