package com.petshop.api.merchant.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record DayHours(
        @Min(1) @Max(7) int dayOfWeek,
        String openTime,
        String closeTime,
        boolean isClosed
) {}
