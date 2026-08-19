package com.petshop.api.merchant.api.dto;

import java.time.Instant;
import java.util.UUID;

public record MerchantSummaryResponse(
        UUID id,
        String businessName,
        String displayName,
        String description,
        String email,
        String phoneNumber,
        String whatsappNumber,
        String nib,
        String npwp,
        String verificationStatus,
        Instant verifiedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
