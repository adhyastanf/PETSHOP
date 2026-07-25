package com.petshop.api.customer.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public record CustomerProfileResponse(
        UUID userId,
        String fullName,
        String email,
        String phoneNumber,
        UUID profileImageFileId,
        String gender,
        LocalDate birthDate
) {
}
