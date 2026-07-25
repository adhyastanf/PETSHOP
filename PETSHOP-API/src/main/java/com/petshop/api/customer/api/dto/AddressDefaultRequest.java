package com.petshop.api.customer.api.dto;

import jakarta.validation.constraints.NotNull;

public record AddressDefaultRequest(@NotNull Boolean isDefault) {
}
