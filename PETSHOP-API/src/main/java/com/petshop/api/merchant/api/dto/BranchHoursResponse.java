package com.petshop.api.merchant.api.dto;

import java.util.List;
import java.util.UUID;

public record BranchHoursResponse(
        UUID branchId,
        List<DayHoursResponse> hours
) {

    public record DayHoursResponse(
            UUID id,
            int dayOfWeek,
            String openTime,
            String closeTime,
            boolean isClosed
    ) {}
}
