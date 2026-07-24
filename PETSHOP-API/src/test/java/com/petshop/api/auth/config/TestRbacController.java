package com.petshop.api.auth.config;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Test-only controller exposing endpoints protected by specific permissions and roles.
 * Used exclusively in integration tests to verify RBAC enforcement.
 * Lives in test source tree so it's only on the classpath during tests.
 */
@RestController
@RequestMapping("/api/v1/test-rbac")
public class TestRbacController {

    @GetMapping("/permission-protected")
    @PreAuthorize("hasAuthority('PERM_test.access')")
    public ResponseEntity<String> permissionProtected() {
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/role-protected")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> roleProtected() {
        return ResponseEntity.ok("OK");
    }
}
