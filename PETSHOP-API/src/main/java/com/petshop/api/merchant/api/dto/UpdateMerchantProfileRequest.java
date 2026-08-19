package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateMerchantProfileRequest(
        @Size(max = 200) String displayName,
        String description,
        @Email @Size(max = 255) String email,
        @Size(max = 30) String phoneNumber,
        @Size(max = 30) String whatsappNumber
) {}
