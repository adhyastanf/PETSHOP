package com.petshop.api.auth.application;

import com.petshop.api.auth.api.dto.AuthResponse;
import com.petshop.api.auth.domain.User;
import io.jsonwebtoken.Claims;

import java.util.UUID;

/**
 * Service responsible for JWT access token generation/validation
 * and refresh token lifecycle management.
 */
public interface TokenService {

    /**
     * Generates a new access token + refresh token pair for the given user.
     *
     * @param user the authenticated user
     * @return AuthResponse containing tokens and metadata
     */
    AuthResponse generateTokenPair(User user);

    /**
     * Validates the given JWT access token and returns its claims.
     *
     * @param jwt the raw JWT string
     * @return parsed Claims
     * @throws InvalidTokenException if the token is invalid or expired
     */
    Claims validateAccessToken(String jwt);

    /**
     * Performs refresh token rotation: validates the raw token, issues new pair,
     * revokes old token, and implements replay detection.
     *
     * @param rawRefreshToken the raw opaque refresh token (Base64URL-encoded)
     * @return AuthResponse with new token pair
     * @throws InvalidTokenException if token is not found, revoked, or expired
     */
    AuthResponse refresh(String rawRefreshToken);

    /**
     * Revokes a specific refresh token (used for logout).
     * Idempotent: silently returns if already revoked, not found, or belongs to a different user.
     *
     * @param userId the authenticated user's ID (cross-user prevention)
     * @param rawRefreshToken the raw opaque refresh token
     */
    void revokeRefreshToken(UUID userId, String rawRefreshToken);
}
