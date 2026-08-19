package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ApplyMerchantRequest(
        @NotBlank @Size(max = 200) String businessName,
        @Size(max = 200) String displayName,
        String description,
        @Email @Size(max = 255) String email,
        @Size(max = 30) String phoneNumber,
        @Size(max = 30) String whatsappNumber,
        @Size(max = 50) String nib,
        @Size(max = 50) String npwp
) {
}
