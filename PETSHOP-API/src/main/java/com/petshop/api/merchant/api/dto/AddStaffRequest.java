package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AddStaffRequest(
        @NotBlank @Email String email,
        @NotBlank String roleCode,
        String employeeCode,
        String displayName
) {}
