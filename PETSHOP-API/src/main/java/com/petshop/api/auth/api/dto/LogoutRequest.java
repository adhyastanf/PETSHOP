package com.petshop.api.auth.api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for logout (revoke refresh token).
 */
public record LogoutRequest(
    @NotBlank String refreshToken
) {}
