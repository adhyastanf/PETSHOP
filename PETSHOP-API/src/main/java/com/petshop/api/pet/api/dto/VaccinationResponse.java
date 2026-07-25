package com.petshop.api.pet.api.dto;

import java.time.LocalDate;
import java.util.UUID;

public record VaccinationResponse(
        UUID id,
        UUID petId,
        UUID vaccineTypeId,
        String vaccineTypeName,
        UUID bookingId,
        UUID merchantId,
        UUID branchId,
        UUID veterinarianStaffId,
        String vaccineNameSnapshot,
        LocalDate vaccinationDate,
        LocalDate nextVaccinationDate,
        String batchNumber,
        UUID certificateFileId,
        String notes
) {
}
