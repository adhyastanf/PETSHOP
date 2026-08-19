package com.petshop.api.merchant.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.merchant.api.dto.ApplyMerchantRequest;
import com.petshop.api.merchant.api.dto.MerchantApplicationResponse;
import com.petshop.api.merchant.application.MerchantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchant/applications")
public class MerchantApplicationController {

    private final MerchantService merchantService;

    public MerchantApplicationController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    /**
     * US-MER-001: Submit merchant application.
     * Requires CUSTOMER role.
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<MerchantApplicationResponse> apply(@Valid @RequestBody ApplyMerchantRequest request) {
        UUID userId = currentUserId();
        MerchantApplicationResponse response = merchantService.applyMerchant(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * US-MER-002: View current user's merchant application(s).
     * Requires any authenticated user.
     */
    @GetMapping("/mine")
    public List<MerchantApplicationResponse> getMyApplications() {
        UUID userId = currentUserId();
        return merchantService.getMyApplications(userId);
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
