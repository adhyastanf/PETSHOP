package com.petshop.api.merchant.api.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record StaffResponse(
        UUID id,
        UUID merchantId,
        UUID userId,
        String userFullName,
        String roleCode,
        String roleName,
        String employeeCode,
        String displayName,
        String status,
        LocalDate joinedAt,
        Instant createdAt,
        Instant updatedAt
) {}
