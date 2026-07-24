package com.petshop.api.auth.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Request DTO for customer registration.
 */
public record RegisterRequest(
    @NotBlank @Size(min = 1, max = 150) String fullName,
    @NotBlank @Email @Size(max = 255) String email,
    @NotBlank @Size(min = 8, max = 72) String password,
    @Pattern(regexp = "^\\+?[0-9]{7,30}$") String phoneNumber
) {}
