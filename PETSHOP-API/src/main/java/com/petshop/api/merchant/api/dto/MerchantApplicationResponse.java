package com.petshop.api.merchant.api.dto;

import java.time.Instant;
import java.util.UUID;

public record MerchantApplicationResponse(
        UUID id,
        String businessName,
        String displayName,
        String verificationStatus,
        Instant createdAt
) {
}
