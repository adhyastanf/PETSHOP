package com.petshop.api.businessconfig.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.businessconfig.api.dto.PaymentMethodResponse;
import com.petshop.api.businessconfig.api.dto.UpdatePaymentMethodRequest;
import com.petshop.api.businessconfig.application.PaymentMethodAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin management of payment method availability (configuration only).
 * Restricted to internal platform roles (ADMIN, SUPER_ADMIN).
 */
@RestController
@RequestMapping("/api/v1/admin/payment-methods")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
public class PaymentMethodAdminController {

    private final PaymentMethodAdminService service;

    public PaymentMethodAdminController(PaymentMethodAdminService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> list() {
        return ResponseEntity.ok(service.list());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePaymentMethodRequest request) {
        return ResponseEntity.ok(service.setActive(id, request.isActive(), currentUserId()));
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
