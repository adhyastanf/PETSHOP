package com.petshop.api.auth.api.dto;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for GET /api/v1/me.
 * Exposes only safe user profile data — never passwordHash or internal IDs beyond user UUID.
 */
public record MeResponse(
        UUID id,
        String fullName,
        String email,
        String phoneNumber,
        String status,
        List<String> roles
) {}
