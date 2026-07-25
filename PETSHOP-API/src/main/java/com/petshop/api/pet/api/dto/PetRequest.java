package com.petshop.api.pet.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PetRequest(
        @NotBlank @Size(max = 150) String name,
        @NotNull UUID petTypeId,
        UUID breedId,
        @Size(max = 20) String gender,
        @PastOrPresent LocalDate birthDate,
        Boolean birthDateEstimated,
        @DecimalMin("0.00") BigDecimal weightKg,
        @Size(max = 100) String color,
        Boolean sterilized,
        @Size(max = 100) String microchipNumber,
        UUID profileImageFileId,
        @Size(max = 4000) String allergies,
        @Size(max = 4000) String specialNotes
) {
}
