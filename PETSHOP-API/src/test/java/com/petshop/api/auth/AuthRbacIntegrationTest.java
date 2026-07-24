package com.petshop.api.auth;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.domain.*;
import com.petshop.api.auth.persistence.RoleRepository;
import com.petshop.api.auth.persistence.UserRepository;
import com.petshop.api.auth.persistence.UserRoleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for RBAC enforcement on protected endpoints.
 * <p>
 * Validates:
 * - Req 10.13: User with required permission can access permission-protected endpoint (200)
 * - Req 10.14: User without required permission receives 403
 * - Req 10.16: User without required role receives 403 on role-protected endpoint
 */
class AuthRbacIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    /**
     * Req 10.13: A user whose role grants the required permission ("test.access")
     * can access the permission-protected endpoint and receives HTTP 200.
     */
    @Test
    void userWithPermission_canAccessEndpoint() throws Exception {
        // Register a user (gets CUSTOMER role by default)
        String email = "rbac-perm-user-" + UUID.randomUUID() + "@test.com";
        AuthResponse auth = registerUser("RBAC Perm User", email, "password123");

        // Create a test permission "test.access" and a role that grants it
        UUID permissionId = createPermission("test.access", "Test Access", "test");
        UUID testRoleId = createRole("TEST_ACCESS_ROLE", "Test Access Role");
        assignPermissionToRole(testRoleId, permissionId);

        // Assign the test role to the user
        User user = userRepository.findByEmail(email).orElseThrow();
        Role testRole = roleRepository.findById(testRoleId).orElseThrow();
        UserRole userRole = UserRole.builder()
                .user(user)
                .role(testRole)
                .build();
        userRoleRepository.save(userRole);

        // Re-login to get a fresh token with updated authorities
        AuthResponse freshAuth = loginUser(email, "password123");

        // Access the permission-protected endpoint
        mockMvc.perform(get("/api/v1/test-rbac/permission-protected")
                        .header("Authorization", "Bearer " + freshAuth.accessToken()))
                .andExpect(status().isOk());
    }

    /**
     * Req 10.14: A user whose role does NOT grant the required permission
     * receives HTTP 403 from the permission-protected endpoint.
     */
    @Test
    void userWithoutPermission_gets403() throws Exception {
        // Register a normal CUSTOMER user (CUSTOMER role does not have "test.access" permission)
        String email = "rbac-no-perm-" + UUID.randomUUID() + "@test.com";
        AuthResponse auth = registerUser("No Perm User", email, "password123");

        // Access the permission-protected endpoint with CUSTOMER token (no test.access permission)
        mockMvc.perform(get("/api/v1/test-rbac/permission-protected")
                        .header("Authorization", "Bearer " + auth.accessToken()))
                .andExpect(status().isForbidden());
    }

    /**
     * Req 10.16: An authenticated user without the required role (ADMIN)
     * receives HTTP 403 on the role-protected endpoint.
     */
    @Test
    void userWithoutRole_gets403OnRoleProtected() throws Exception {
        // Register a normal CUSTOMER user (not ADMIN)
        String email = "rbac-no-role-" + UUID.randomUUID() + "@test.com";
        AuthResponse auth = registerUser("No Role User", email, "password123");

        // Access the role-protected endpoint (requires ROLE_ADMIN)
        mockMvc.perform(get("/api/v1/test-rbac/role-protected")
                        .header("Authorization", "Bearer " + auth.accessToken()))
                .andExpect(status().isForbidden());
    }

    // --- Helper methods for test data setup ---

    private UUID createPermission(String code, String name, String module) {
        UUID id = UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO permissions (id, code, name, module) VALUES (?, ?, ?, ?)",
                id, code, name, module
        );
        return id;
    }

    private UUID createRole(String code, String name) {
        UUID id = UUID.randomUUID();
        jdbcTemplate.update(
                "INSERT INTO roles (id, code, name, scope, is_system, created_at) VALUES (?, ?, ?, 'PLATFORM', false, NOW())",
                id, code, name
        );
        return id;
    }

    private void assignPermissionToRole(UUID roleId, UUID permissionId) {
        jdbcTemplate.update(
                "INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)",
                roleId, permissionId
        );
    }
}
