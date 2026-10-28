package com.petshop.api.pet.api.dto;

import java.util.UUID;

public record PetTypeResponse(
        UUID id,
        String code,
        String name,
        Integer sortOrder
) {
}
