package com.petshop.api.auth;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.api.dto.RefreshRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the refresh token endpoint (POST /api/v1/auth/refresh).
 * Validates Requirements 10.9, 10.10, 10.11.
 */
class AuthRefreshIntegrationTest extends BaseIntegrationTest {

    private String uniqueEmail() {
        return "refresh-" + UUID.randomUUID() + "@example.com";
    }

    /**
     * Req 10.9: Refresh rotation issues new tokens that differ from originals.
     */
    @Test
    void refreshRotation_issuesNewTokens() throws Exception {
        // Register a fresh user to get initial tokens
        String email = uniqueEmail();
        AuthResponse initial = registerUser("Refresh User", email, "SecurePass123");

        // Perform refresh with the original refresh token
        RefreshRequest refreshRequest = new RefreshRequest(initial.refreshToken());

        MvcResult result = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(refreshRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.expiresIn", is(900)))
                .andReturn();

        AuthResponse refreshed = objectMapper.readValue(
                result.getResponse().getContentAsString(), AuthResponse.class);

        // New tokens must differ from the originals
        assertThat(refreshed.accessToken())
                .as("New access token should differ from original")
                .isNotEqualTo(initial.accessToken());
        assertThat(refreshed.refreshToken())
                .as("New refresh token should differ from original (rotation)")
                .isNotEqualTo(initial.refreshToken());
    }

    /**
     * Req 10.10: After rotation, the old refresh token is rejected with 401.
     */
    @Test
    void oldTokenRejectedAfterRotation() throws Exception {
        // Register a fresh user
        String email = uniqueEmail();
        AuthResponse initial = registerUser("Old Token User", email, "SecurePass123");

        // Perform refresh once (rotates the token)
        RefreshRequest firstRefresh = new RefreshRequest(initial.refreshToken());
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRefresh)))
                .andExpect(status().isOk());

        // Try to use the old (now revoked) refresh token again
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRefresh)))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Req 10.11: Replay detection — presenting a revoked token revokes all active
     * tokens for that user (both old and new tokens become invalid).
     */
    @Test
    void replayDetection_revokesAllTokens() throws Exception {
        // Register a fresh user
        String email = uniqueEmail();
        AuthResponse initial = registerUser("Replay User", email, "SecurePass123");

        // Perform a refresh to rotate: old token is now revoked, new token is active
        RefreshRequest firstRefresh = new RefreshRequest(initial.refreshToken());
        MvcResult rotateResult = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRefresh)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse rotated = objectMapper.readValue(
                rotateResult.getResponse().getContentAsString(), AuthResponse.class);

        // Replay the old (revoked) token — triggers replay detection, revoking all tokens
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRefresh)))
                .andExpect(status().isUnauthorized());

        // Now the new token should also be revoked (replay protection)
        RefreshRequest newTokenRefresh = new RefreshRequest(rotated.refreshToken());
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newTokenRefresh)))
                .andExpect(status().isUnauthorized());
    }

    /**
     * Missing refresh token in body returns 400.
     */
    @Test
    void missingRefreshToken_returns400() throws Exception {
        // POST with empty body
        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
