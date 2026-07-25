package com.petshop.api.customer.api.dto;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateCustomerProfileRequest(
        @Size(max = 150) String fullName,
        @Size(max = 30) String phoneNumber,
        UUID profileImageFileId,
        @Size(max = 20) String gender,
        @PastOrPresent LocalDate birthDate
) {
}
