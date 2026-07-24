package com.petshop.api.auth;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.api.dto.LogoutRequest;
import com.petshop.api.auth.api.dto.RefreshRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for the logout endpoint (POST /api/v1/auth/logout).
 * Validates Requirement 10.12: logout revokes token, idempotent behavior, and validation.
 */
class AuthLogoutIntegrationTest extends BaseIntegrationTest {

    @Test
    void logout_revokesToken_subsequentRefreshReturns401() throws Exception {
        // Register a user to get tokens
        String email = "logout-test-" + UUID.randomUUID() + "@example.com";
        AuthResponse auth = registerUser("Logout Test User", email, "SecurePass123!");

        // Logout with the refresh token (requires Bearer access token)
        LogoutRequest logoutRequest = new LogoutRequest(auth.refreshToken());

        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isNoContent());

        // Attempt to refresh with the revoked token → 401
        RefreshRequest refreshRequest = new RefreshRequest(auth.refreshToken());

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void logout_alreadyRevokedToken_returns204() throws Exception {
        // Register a user to get tokens
        String email = "logout-idempotent-" + UUID.randomUUID() + "@example.com";
        AuthResponse auth = registerUser("Idempotent Test User", email, "SecurePass123!");

        LogoutRequest logoutRequest = new LogoutRequest(auth.refreshToken());

        // First logout — should succeed with 204
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isNoContent());

        // Second logout with same token — should still return 204 (idempotent)
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(logoutRequest)))
                .andExpect(status().isNoContent());
    }

    @Test
    void logout_missingRefreshToken_returns400() throws Exception {
        // Register a user to get a valid access token
        String email = "logout-missing-" + UUID.randomUUID() + "@example.com";
        AuthResponse auth = registerUser("Missing Token User", email, "SecurePass123!");

        // POST /api/v1/auth/logout with empty body (missing refreshToken field) → 400
        mockMvc.perform(post("/api/v1/auth/logout")
                        .header("Authorization", "Bearer " + auth.accessToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
