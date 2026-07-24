package com.petshop.api.auth.api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for email/password login.
 */
public record LoginRequest(
    @NotBlank String email,
    @NotBlank String password
) {}
