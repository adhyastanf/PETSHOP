package com.petshop.api.pet.api.dto;

import java.util.UUID;

public record PetBreedResponse(
        UUID id,
        UUID petTypeId,
        String name
) {
}
