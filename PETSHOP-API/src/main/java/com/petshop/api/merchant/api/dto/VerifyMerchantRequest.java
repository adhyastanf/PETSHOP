package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyMerchantRequest(
        @NotBlank String decision,
        String notes,
        String rejectionReason
) {
}
