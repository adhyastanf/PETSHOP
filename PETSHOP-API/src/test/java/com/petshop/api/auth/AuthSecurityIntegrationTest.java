package com.petshop.api.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for security infrastructure: authentication entry point,
 * JWT validation edge cases, and error response format.
 * Validates Requirements 10.8, 10.15, and verifies non-regression (10.17).
 */
class AuthSecurityIntegrationTest extends BaseIntegrationTest {

    private static final String ME_ENDPOINT = "/api/v1/me";
    private static final String TEST_SECRET = "test-secret-key-that-is-at-least-32-bytes-long!!";

    /**
     * Req 10.15: Anonymous request (no Authorization header) to a protected endpoint
     * returns 401 with JSON body containing code "UNAUTHENTICATED".
     */
    @Test
    void noAuthorizationHeader_returns401WithJsonBody() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.timestamp").isNotEmpty());
    }

    /**
     * Req 10.8: Bearer token with non-Bearer scheme or malformed Authorization header
     * returns 401.
     */
    @Test
    void nonBearerScheme_returns401() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Basic dXNlcjpwYXNz"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.8: JWT signed with a different secret key → 401.
     */
    @Test
    void jwtSignedWithWrongSecret_returns401() throws Exception {
        SecretKey wrongKey = Keys.hmacShaKeyFor(
                "wrong-secret-key-that-is-also-at-least-32-bytes!".getBytes(StandardCharsets.UTF_8));

        String tampered = Jwts.builder()
                .subject(UUID.randomUUID().toString())
                .claim("email", "tampered@example.com")
                .claim("authorities", List.of("ROLE_CUSTOMER"))
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plusSeconds(900)))
                .signWith(wrongKey)
                .compact();

        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.8: Completely malformed JWT (not three dot-separated parts) → 401.
     */
    @Test
    void malformedJwt_returns401() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer not.a.valid.jwt.at.all"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Req 10.8: Empty Bearer token → 401.
     */
    @Test
    void emptyBearerToken_returns401() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT)
                        .header("Authorization", "Bearer "))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")));
    }

    /**
     * Verify 401 response has proper JSON format with required fields
     * (code, message, timestamp) per the error response specification.
     */
    @Test
    void unauthenticatedResponse_hasProperJsonFormat() throws Exception {
        mockMvc.perform(get(ME_ENDPOINT))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith("application/json"))
                .andExpect(jsonPath("$.code", is("UNAUTHENTICATED")))
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.timestamp").isString());
    }
}
