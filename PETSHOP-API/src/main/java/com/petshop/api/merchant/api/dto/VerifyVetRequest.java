package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyVetRequest(
        @NotBlank String decision,
        String notes
) {}
