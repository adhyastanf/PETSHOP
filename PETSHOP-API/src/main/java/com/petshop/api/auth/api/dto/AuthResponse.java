package com.petshop.api.auth.api.dto;

import java.util.UUID;

/**
 * Response DTO returned on successful authentication (login, register, refresh).
 */
public record AuthResponse(
    UUID userId,
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn
) {}
