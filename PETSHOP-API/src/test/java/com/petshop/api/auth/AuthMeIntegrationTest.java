package com.petshop.api.auth;

import com.petshop.api.auth.api.dto.AuthResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the GET /api/v1/me endpoint.
 * Validates Requirements 10.7, 10.8, 10.15.
 */
class AuthMeIntegrationTest extends BaseIntegrationTest {

    private static final String ME_ENDPOINT = "/api/v1/me";
    private static final String TEST_SECRET = "test-secret-key-that-is-at-least-32-bytes-long!!";

    /**
     * Req 10.7: Valid JWT → 200 on GET /api/v1/me with correct profile data.
     */
    @Test
    void validJwt_returns200WithProfile() throws Exception {
        String email = "me-valid@example.com";
        String password = "SecurePass123";
        AuthResponse authResponse = registerUser("Me Valid User", email, password);

        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer " + authResponse.accessToken()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.fullName", is("Me Valid User")))
                .andExpect(jsonPath("$.email", is(email)))
                .andExpect(jsonPath("$.status", is("ACTIVE")))
                .andExpect(jsonPath("$.roles", hasItem("CUSTOMER")));
    }

    /**
     * Req 10.8: Invalid JWT (garbage token) → 401 with code UNAUTHENTICATED.
     */
    @Test
    void invalidJwt_returns401() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer invalid-garbage-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.8: Expired JWT → 401 with code UNAUTHENTICATED.
     */
    @Test
    void expiredJwt_returns401() throws Exception {
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));

        // Generate a JWT that expired 1 hour ago
        Instant pastTime = Instant.now().minusSeconds(7200);
        Instant expiredAt = Instant.now().minusSeconds(3600);

        String expiredToken = Jwts.builder()
                .subject(UUID.randomUUID().toString())
                .claim("email", "expired@example.com")
                .claim("authorities", List.of("ROLE_CUSTOMER"))
                .issuedAt(Date.from(pastTime))
                .expiration(Date.from(expiredAt))
                .signWith(key)
                .compact();

        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.15: Anonymous request (no Authorization header) → 401 with code UNAUTHENTICATED.
     */
    @Test
    void anonymousRequest_returns401() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Security: Response body from GET /me never contains passwordHash or password_hash.
     */
    @Test
    void responseNeverContainsPasswordHash() throws Exception {
        String email = "me-nopwhash@example.com";
        String password = "SecurePass123";
        AuthResponse authResponse = registerUser("No PW Hash User", email, password);

        String responseBody = mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer " + authResponse.accessToken()))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Assert response body does NOT contain password hash references
        assert !responseBody.contains("passwordHash") : "Response should not contain 'passwordHash'";
        assert !responseBody.contains("password_hash") : "Response should not contain 'password_hash'";
    }
}
