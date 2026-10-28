package com.petshop.api.pet.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PetResponse(
        UUID id,
        String name,
        UUID petTypeId,
        String petTypeCode,
        String petTypeName,
        UUID breedId,
        String breedName,
        String gender,
        LocalDate birthDate,
        Boolean birthDateEstimated,
        BigDecimal weightKg,
        String color,
        Boolean sterilized,
        String microchipNumber,
        UUID profileImageFileId,
        String allergies,
        String specialNotes
) {
}
