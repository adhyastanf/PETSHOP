package com.petshop.api.auth.api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for refresh token rotation.
 */
public record RefreshRequest(
    @NotBlank String refreshToken
) {}
