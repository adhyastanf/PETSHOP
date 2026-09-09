package com.petshop.api.businessconfig.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.businessconfig.api.dto.CommissionRuleResponse;
import com.petshop.api.businessconfig.api.dto.CreateCommissionRuleRequest;
import com.petshop.api.businessconfig.api.dto.UpdateCommissionRuleRequest;
import com.petshop.api.businessconfig.application.CommissionRuleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin management of commission rules (configuration only).
 * Restricted to internal platform roles (ADMIN, SUPER_ADMIN).
 */
@RestController
@RequestMapping("/api/v1/admin/commission-rules")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
public class CommissionRuleAdminController {

    private final CommissionRuleService service;

    public CommissionRuleAdminController(CommissionRuleService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CommissionRuleResponse>> list() {
        return ResponseEntity.ok(service.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommissionRuleResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.get(id));
    }

    @PostMapping
    public ResponseEntity<CommissionRuleResponse> create(
            @Valid @RequestBody CreateCommissionRuleRequest request) {
        CommissionRuleResponse response = service.create(request, currentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommissionRuleResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCommissionRuleRequest request) {
        return ResponseEntity.ok(service.update(id, request, currentUserId()));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<CommissionRuleResponse> activate(@PathVariable UUID id) {
        return ResponseEntity.ok(service.setActive(id, true, currentUserId()));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<CommissionRuleResponse> deactivate(@PathVariable UUID id) {
        return ResponseEntity.ok(service.setActive(id, false, currentUserId()));
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
