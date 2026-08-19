package com.petshop.api.merchant.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BranchResponse(
        UUID id,
        UUID merchantId,
        String code,
        String name,
        String phoneNumber,
        String email,
        String provinceName,
        String cityName,
        String districtName,
        String subdistrictName,
        String postalCode,
        String addressLine,
        BigDecimal latitude,
        BigDecimal longitude,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {}
