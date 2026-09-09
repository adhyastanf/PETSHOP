package com.petshop.api.businessconfig.api.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Request to enable or disable a payment method. This task manages availability
 * only; payment processing and provider integration are deferred to later phases.
 */
public record UpdatePaymentMethodRequest(
        @NotNull Boolean isActive
) {
}
