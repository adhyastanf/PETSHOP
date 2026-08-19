package com.petshop.api.merchant.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record MerchantProfileResponse(
        UUID id,
        String businessName,
        String displayName,
        String description,
        String email,
        String phoneNumber,
        String whatsappNumber,
        String nib,
        String npwp,
        UUID logoFileId,
        UUID bannerFileId,
        String verificationStatus,
        BigDecimal ratingAverage,
        Integer ratingCount,
        Instant verifiedAt,
        Instant createdAt,
        Instant updatedAt
) {}
