package com.petshop.api.businessconfig.api;

import com.petshop.api.auth.security.SecurityContextUtil;
import com.petshop.api.businessconfig.api.dto.SystemConfigResponse;
import com.petshop.api.businessconfig.api.dto.UpdateSystemConfigRequest;
import com.petshop.api.businessconfig.application.SystemConfigAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin management of system-level business configuration.
 * Restricted to internal platform roles (ADMIN, SUPER_ADMIN).
 */
@RestController
@RequestMapping("/api/v1/admin/config")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')")
public class SystemConfigAdminController {

    private final SystemConfigAdminService service;

    public SystemConfigAdminController(SystemConfigAdminService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SystemConfigResponse>> list() {
        return ResponseEntity.ok(service.listManaged());
    }

    @GetMapping("/{key}")
    public ResponseEntity<SystemConfigResponse> get(@PathVariable String key) {
        return ResponseEntity.ok(service.get(key));
    }

    @PutMapping("/{key}")
    public ResponseEntity<SystemConfigResponse> update(
            @PathVariable String key,
            @Valid @RequestBody UpdateSystemConfigRequest request) {
        return ResponseEntity.ok(service.update(key, request.value(), currentUserId()));
    }

    private UUID currentUserId() {
        return SecurityContextUtil.getCurrentUserId()
                .orElseThrow(() -> new IllegalStateException("Authenticated user ID not found"));
    }
}
